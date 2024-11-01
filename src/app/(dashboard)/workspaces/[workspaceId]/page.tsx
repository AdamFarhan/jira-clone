import { redirect } from "next/navigation";

import { getAuthedUser } from "@/features/auth/queries";
import { getWorkspace } from "@/features/workspaces/queries";

interface Props {
  params: {
    workspaceId: string;
  };
}

async function WorkspaceIdPage({ params }: Props) {
  const user = await getAuthedUser();
  if (!user) redirect("/sign-in");

  const workspace = await getWorkspace({ workspaceId: params.workspaceId });
  if (!workspace) redirect("/");

  return <div>WorkspaceIdPage</div>;
}

export default WorkspaceIdPage;
