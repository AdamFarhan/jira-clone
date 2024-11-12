import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { Query } from "node-appwrite";

import { sessionMiddleware } from "@/lib/sessionMiddleware";
import { createAdminClient } from "@/lib/appwrite";
import { DATABASE_ID, MEMBERS_ID } from "@/config";

import { getMember } from "../utils";
import { Member, MemberRole } from "../types";

const app = new Hono()
  /* Get all members of a given workspace */
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({ workspaceId: z.string() })),
    async (c) => {
      const { users } = await createAdminClient();
      const databases = c.get("databases");
      const user = c.get("user");
      const { workspaceId } = c.req.valid("query");

      const member = getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      //Gets a list of user IDs that are members of the given workspace
      const memberIds = await databases.listDocuments<Member>(
        DATABASE_ID,
        MEMBERS_ID,
        [Query.equal("workspaceId", workspaceId)]
      );

      const members = await Promise.all(
        memberIds.documents.map(async (member) => {
          const user = await users.get(member.userId);

          return {
            ...member,
            name: user.name,
            email: user.email,
            role: member.role as string,
          };
        })
      );

      return c.json({ data: { ...memberIds, documents: members } });
    }
  )
  .delete("/:memberId", sessionMiddleware, async (c) => {
    const { memberId } = c.req.param();
    const user = c.get("user");
    const databases = c.get("databases");

    const memberToDelete = await databases.getDocument(
      DATABASE_ID,
      MEMBERS_ID,
      memberId
    );

    const allMembersInWorkspace = await databases.listDocuments(
      DATABASE_ID,
      MEMBERS_ID,
      [Query.equal("workspaceId", memberToDelete.workspaceId)]
    );

    const member = await getMember({
      databases,
      workspaceId: memberToDelete.workspaceId,
      userId: user.$id,
    });

    // If you're not a even a member of this workspace, you are unauthorized
    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // If you try to delete another member that isn't YOU, but you are not an admin, you are unauthorized
    if (member.$id !== memberToDelete.$id && member.role !== MemberRole.ADMIN) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Prevent deleting the only member in a workspace
    if (allMembersInWorkspace.total === 1) {
      return c.json({ error: "Cannot delete the only member" }, 400);
    }

    await databases.deleteDocument(DATABASE_ID, MEMBERS_ID, memberId);

    return c.json({ data: { $id: memberToDelete.$id } });
  })
  /* Modify role of the member */
  .patch(
    "/:memberId",
    sessionMiddleware,
    zValidator("json", z.object({ role: z.nativeEnum(MemberRole) })),
    async (c) => {
      const { memberId } = c.req.param();
      const { role } = c.req.valid("json");
      const user = c.get("user");
      const databases = c.get("databases");

      const memberToUpdate = await databases.getDocument(
        DATABASE_ID,
        MEMBERS_ID,
        memberId
      );

      const allMembersInWorkspace = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        [Query.equal("workspaceId", memberToUpdate.workspaceId)]
      );

      const member = await getMember({
        databases,
        workspaceId: memberToUpdate.workspaceId,
        userId: user.$id,
      });

      // If you're not a even a member of this workspace, you are unauthorized
      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // If you are not an admin, you cannot change people's roles
      if (member.role !== MemberRole.ADMIN) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Prevent updating the only member in a workspace
      if (allMembersInWorkspace.total === 1) {
        return c.json({ error: "Cannot change the only member" }, 400);
      }

      await databases.updateDocument(DATABASE_ID, MEMBERS_ID, memberId, {
        role,
      });

      return c.json({ data: { $id: memberToUpdate.$id } });
    }
  );
export default app;
