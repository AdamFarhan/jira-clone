import { createSessionClient } from "@/lib/appwrite";
import { DATABASE_ID, PROJECTS_ID } from "@/config";

import { getMember } from "../members/utils";
import { Project } from "./types";

/** Returns the full project to members */
export const getProject = async ({ projectId }: { projectId: string }) => {
  const { account, databases } = await createSessionClient();

  const user = await account.get();

  const project = await databases.getDocument<Project>(
    DATABASE_ID,
    PROJECTS_ID,
    projectId
  );

  const member = await getMember({
    databases,
    workspaceId: project.workspaceId,
    userId: user.$id,
  });

  if (!member) {
    throw new Error("Unauthorized");
  }

  return project;
};
