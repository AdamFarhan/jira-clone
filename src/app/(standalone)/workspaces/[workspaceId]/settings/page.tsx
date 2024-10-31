import { getAuthedUser } from "@/features/auth/actions";
import { getWorkspace } from "@/features/workspaces/actions";
import { EditWorkspaceForm } from "@/features/workspaces/components/EditWorkspaceForm";
import { redirect } from "next/navigation";

interface WorkspaceSettingsPageProps {
  params: {
    workspaceId: string;
  };
}

const WorkspaceSettingsPage = async ({
  params,
}: WorkspaceSettingsPageProps) => {
  const user = await getAuthedUser();
  if (!user) redirect("/sign-in");

  const initivalValues = await getWorkspace({
    workspaceId: params.workspaceId,
  });

  if (!initivalValues) {
    redirect(`/workspaces/${params.workspaceId}`);
  }

  return (
    <div className="w-full lg:max-w-xl">
      <EditWorkspaceForm initialValues={initivalValues} />
    </div>
  );
};

export default WorkspaceSettingsPage;
