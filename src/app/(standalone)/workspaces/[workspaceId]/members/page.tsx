import { redirect, useParams } from "next/navigation";
import { getAuthedUser } from "@/features/auth/queries";
import { MembersList } from "@/features/workspaces/components/MembersList";
import { getWorkspace } from "@/features/workspaces/queries";
type PageProps = {
  params: {
    workspaceId: string;
  };
};
const WorkspaceMembersPage = async ({ params }: PageProps) => {
  const user = getAuthedUser();
  if (!user) redirect("/");

  const workspace = await getWorkspace({ workspaceId: params.workspaceId });
  if (!workspace) redirect("/");

  return (
    <div className="w-full lg:max-w-xl">
      <MembersList workspace={workspace} />
    </div>
  );
};

export default WorkspaceMembersPage;
