"use server";

import { Query } from "node-appwrite";
import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";
import { getMember } from "../members/utils";
import { Workspace } from "./types";
import { createSessionClient } from "@/lib/appwrite";

/** Returns a list of workspaces the user is a member of */
export const getWorkspaces = async () => {
  const { account, databases } = await createSessionClient();

  const user = await account.get();

  // Get list  of memberships that user is apart of (users can be members of workspaces)
  const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
    Query.equal("userId", user.$id),
  ]);

  // If user is not part of any workspaces, return a mocked empty data set
  if (members.total === 0) {
    return { documents: [], total: 0 };
  }

  // Grab list of workspace Ids that user is a member of
  const workspaceIds = members.documents.map((member) => member.workspaceId);

  const workspaces = await databases.listDocuments(DATABASE_ID, WORKSPACES_ID, [
    Query.orderDesc("$createdAt"),
    Query.contains("$id", workspaceIds),
  ]);

  return workspaces;
};

/** Returns the full workspace to members */
export const getWorkspace = async ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  const { account, databases } = await createSessionClient();

  const user = await account.get();

  const member = await getMember({
    databases,
    workspaceId,
    userId: user.$id,
  });

  if (!member) {
    throw new Error("Unauthorized");
  }

  const workspace = await databases.getDocument<Workspace>(
    DATABASE_ID,
    WORKSPACES_ID,
    workspaceId
  );

  return workspace;
};

/** Returns basic information about a workspace to non members */
export const getWorkspaceInfo = async ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  const { databases } = await createSessionClient();

  const workspace = await databases.getDocument<Workspace>(
    DATABASE_ID,
    WORKSPACES_ID,
    workspaceId
  );

  return {
    name: workspace.name,
    imageUrl: workspace.imageUrl,
    inviteCode: workspace.inviteCode,
  };
};
