import { redirect } from "next/navigation";
import { getAuthedUser } from "@/features/auth/queries";
import { getProject } from "@/features/projects/queries";
import { EditProjectForm } from "@/features/projects/components/EditProjectForm";

type Props = {
  params: {
    projectId: string;
  };
};
const ProjectSettingsPage = async ({ params }: Props) => {
  const user = await getAuthedUser();
  if (!user) redirect("/sign-in");

  const initialValues = await getProject({ projectId: params.projectId });

  return (
    <div className="w-full lg:max-w-xl">
      <EditProjectForm initialValues={initialValues} />
    </div>
  );
};

export default ProjectSettingsPage;
