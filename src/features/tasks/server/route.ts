import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { ID, Query } from "node-appwrite";
import { z } from "zod";

import { DATABASE_ID, MEMBERS_ID, PROJECTS_ID, TASKS_ID } from "@/config";
import { sessionMiddleware } from "@/lib/sessionMiddleware";
import { createAdminClient } from "@/lib/appwrite";

import { getMember } from "@/features/members/utils";
import { Project } from "@/features/projects/types";

import { createTaskSchema } from "../schemas";
import { Task, TaskStatus } from "../types";

const app = new Hono()
  /** Get all tasks */
  .get(
    "/",
    sessionMiddleware,
    zValidator(
      "query",
      z.object({
        workspaceId: z.string(),
        projectId: z.string().nullish(),
        assigneeId: z.string().nullish(),
        status: z.nativeEnum(TaskStatus).nullish(),
        search: z.string().nullish(),
        dueDate: z.string().nullish(),
      })
    ),
    async (c) => {
      const { users } = await createAdminClient();
      const databases = c.get("databases");
      const user = c.get("user");
      const { workspaceId, projectId, status, search, assigneeId, dueDate } =
        c.req.valid("query");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Build query based on user provided filters
      const query = [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt"),
      ];

      if (projectId) {
        console.log("projectId", projectId);
        query.push(Query.equal("projectId", projectId));
      }
      if (status) {
        console.log("status", status);
        query.push(Query.equal("status", status));
      }
      if (assigneeId) {
        console.log("assigneeId", assigneeId);
        query.push(Query.equal("assigneeId", assigneeId));
      }

      if (dueDate) {
        console.log("dueDate", dueDate);
        query.push(Query.equal("dueDate", dueDate));
      }

      if (search) {
        console.log("search", search);
        query.push(Query.search("name", search));
      }

      // Get all tasks based on query
      const tasks = await databases.listDocuments<Task>(
        DATABASE_ID,
        TASKS_ID,
        query
      );

      const projectIds = tasks.documents.map((task) => task.projectId);
      const assigneeIds = tasks.documents.map((task) => task.assigneeId);

      // Get a list of projects and people who are attached to the tasks
      const projects = await databases.listDocuments<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        projectIds.length > 0 ? [Query.contains("$id", projectIds)] : []
      );
      const members = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        assigneeIds.length > 0 ? [Query.contains("$id", assigneeIds)] : []
      );

      // Get the actual Users based on the member ids
      const assignees = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.userId);

          return {
            ...member,
            name: user.name || user.email,
            email: user.email,
          };
        })
      );

      // Build a Populated Task that includes the project, and the User attached to the ticket
      const populatedTasks = tasks.documents.map((task) => {
        const project = projects.documents.find(
          (project) => project.$id === task.projectId
        );
        const assignee = assignees.find(
          (assignee) => assignee.$id === task.assigneeId
        );

        return {
          ...task,
          project,
          assignee,
        };
      });

      // Return the original task metadata (total), as well as the populated tasks under documents
      return c.json({
        data: {
          ...tasks,
          documents: populatedTasks,
        },
      });
    }
  )
  /** Get a single task */
  .get("/:taskId", sessionMiddleware, async (c) => {
    const currentUser = c.get("user");
    const databases = c.get("databases");
    const { users } = await createAdminClient();
    const { taskId } = c.req.param();

    const task = await databases.getDocument<Task>(
      DATABASE_ID,
      TASKS_ID,
      taskId
    );
    const currentMember = await getMember({
      databases,
      workspaceId: task.workspaceId,
      userId: currentUser.$id,
    });

    if (!currentMember) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get the project the task is stored in
    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      task.projectId
    );

    // Get the membership info for the user that's assigned this task
    // (not the one who queried)
    const member = await databases.getDocument(
      DATABASE_ID,
      MEMBERS_ID,
      task.assigneeId
    );

    // Get the user info from the membership
    const user = await users.get(member.userId);

    // Build a fleshed out user
    const assignee = {
      ...member,
      name: user.name || user.email,
      email: user.email,
    };

    // Attach project info and user info for the assignee with the task info
    return c.json({
      data: {
        ...task,
        project,
        assignee,
      },
    });
  })
  /** Create New Task */
  .post(
    "/",
    sessionMiddleware,
    zValidator("json", createTaskSchema),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const {
        name,
        status,
        workspaceId,
        projectId,
        assigneeId,
        dueDate,
        description,
      } = c.req.valid("json");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Get the highest task in the column
      const highestPositionTask = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal("status", status),
          Query.equal("workspaceId", workspaceId),
          Query.orderAsc("position"),
          Query.limit(1),
        ]
      );

      // If we have no highest tasks, that column is empty so default to 1000
      // If we do have a highest task, set new task to that position plus 1000
      const newPosition =
        highestPositionTask.documents.length > 0
          ? highestPositionTask.documents[0].position + 1000
          : 1000;

      const task = await databases.createDocument(
        DATABASE_ID,
        TASKS_ID,
        ID.unique(),
        {
          name,
          status,
          workspaceId,
          projectId,
          dueDate,
          assigneeId,
          description,
          position: newPosition,
        }
      );

      return c.json({ data: task });
    }
  )
  /** Delete a task */
  .delete("/:taskId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");
    const { taskId } = c.req.param();

    const task = await databases.getDocument<Task>(
      DATABASE_ID,
      TASKS_ID,
      taskId
    );

    const member = await getMember({
      databases,
      workspaceId: task.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    await databases.deleteDocument(DATABASE_ID, TASKS_ID, taskId);

    return c.json({ data: { $id: task.$id } });
  })
  /** Edit a task */
  .patch(
    "/:taskId",
    sessionMiddleware,
    zValidator("json", createTaskSchema.partial()),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const { taskId } = c.req.param();

      const { name, status, projectId, assigneeId, dueDate, description } =
        c.req.valid("json");

      const existingTask = await databases.getDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        taskId
      );

      const member = await getMember({
        databases,
        workspaceId: existingTask.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const task = await databases.updateDocument(
        DATABASE_ID,
        TASKS_ID,
        taskId,
        {
          name,
          status,
          projectId,
          dueDate,
          assigneeId,
          description,
        }
      );

      return c.json({ data: task });
    }
  )
  /** Bulk edit tasks */
  .post(
    "/bulk-update",
    sessionMiddleware,
    zValidator(
      "json",
      z.object({
        tasks: z.array(
          z.object({
            $id: z.string(),
            status: z.nativeEnum(TaskStatus),
            position: z.number().int().positive().min(1000).max(1_000_000),
          })
        ),
      })
    ),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const { tasks } = c.req.valid("json");
      const tasksToUpdate = await databases.listDocuments<Task>(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.contains(
            "$id",
            tasks.map((task) => task.$id)
          ),
        ]
      );

      // Make sure all the tasks are in the same workspace
      // Helps pervent against malicious updates

      const workspaceIds = new Set(
        tasksToUpdate.documents.map((task) => task.workspaceId)
      );

      if (workspaceIds.size !== 1) {
        return c.json(
          { error: "All tasks must be in the same workspace" },
          400
        );
      }

      const workspaceId = workspaceIds.values().next().value as string;

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const updatedTasks = await Promise.all(
        tasks.map(async (task) => {
          const { $id, status, position } = task;

          return databases.updateDocument<Task>(DATABASE_ID, TASKS_ID, $id, {
            status,
            position,
          });
        })
      );

      return c.json({ data: updatedTasks });
    }
  );
export default app;
