import { redirect } from "next/navigation";
import { getAuthedUser } from "@/features/auth/queries";
import { ProjectSettingsClient } from "./client";

const ProjectSettingsPage = async () => {
  const user = await getAuthedUser();
  if (!user) redirect("/sign-in");

  return <ProjectSettingsClient />;
};

export default ProjectSettingsPage;
