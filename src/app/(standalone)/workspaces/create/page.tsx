import { redirect } from "next/navigation";

import { getAuthedUser } from "@/features/auth/queries";
import { CreateWorkspaceForm } from "@/features/workspaces/components/CreateWorkspaceForm";

async function WorkspaceCreatePage() {
  const user = await getAuthedUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="w-full lg:max-w-xl">
      <CreateWorkspaceForm />
    </div>
  );
}

export default WorkspaceCreatePage;
