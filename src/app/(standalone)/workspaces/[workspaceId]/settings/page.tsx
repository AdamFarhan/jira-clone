import { getAuthedUser } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import { WorkspaceSettingsClient } from "./client";

const WorkspaceSettingsPage = async () => {
  const user = await getAuthedUser();
  if (!user) redirect("/sign-in");

  return <WorkspaceSettingsClient />;
};

export default WorkspaceSettingsPage;
