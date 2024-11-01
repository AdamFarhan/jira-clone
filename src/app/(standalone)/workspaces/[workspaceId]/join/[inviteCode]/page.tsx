import { getAuthedUser } from "@/features/auth/queries";
import { InvalidInvite } from "@/features/workspaces/components/InvalidInvite";
import { JoinWorkspaceForm } from "@/features/workspaces/components/JoinWorkspaceForm";
import { getWorkspaceInfo } from "@/features/workspaces/queries";
import { redirect } from "next/navigation";

interface WorkspaceJoinPageProps {
  params: {
    workspaceId: string;
    inviteCode: string;
  };
}

const WorkspaceJoinPage = async ({ params }: WorkspaceJoinPageProps) => {
  const user = await getAuthedUser();
  if (!user) redirect("/sign-in");

  const workspace = await getWorkspaceInfo({
    workspaceId: params.workspaceId,
  });

  if (!workspace) {
    redirect("/");
  }

  if (params.inviteCode !== workspace.inviteCode) {
    return (
      <div className="w-full lg:max-w-xl">
        <InvalidInvite />
      </div>
    );
  }

  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkspaceForm initialValues={workspace} />
    </div>
  );
};

export default WorkspaceJoinPage;
