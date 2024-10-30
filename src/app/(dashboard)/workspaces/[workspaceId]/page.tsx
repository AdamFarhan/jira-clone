import { redirect } from "next/navigation";

import { getAuthedUser } from "@/features/auth/actions";

async function WorkspaceIdPage() {
  const user = await getAuthedUser();
  if (!user) redirect("/sign-in");

  return <div>WorkspaceIdPage</div>;
}

export default WorkspaceIdPage;
