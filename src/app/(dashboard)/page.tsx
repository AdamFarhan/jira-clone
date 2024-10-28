import { getAuthedUser } from "@/features/auth/actions";
import { CreateWorkspaceForm } from "@/features/workspaces/components/CreateWorkspaceForm";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getAuthedUser();

  if (!user) redirect("/sign-in");

  return (
    <div className="bg-neutral-500 h-full p-4">
      <CreateWorkspaceForm />
    </div>
  );
}
