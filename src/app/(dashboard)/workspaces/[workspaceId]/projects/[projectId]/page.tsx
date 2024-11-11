import { redirect } from "next/navigation";

import { getAuthedUser } from "@/features/auth/queries";
import { ProjectClient } from "./client";

const ProjectPage = async () => {
  const user = getAuthedUser();
  if (!user) redirect("/sign-in");

  return <ProjectClient />;
};

export default ProjectPage;
