import { redirect } from "next/navigation";
import { getAuthedUser } from "@/features/auth/queries";
import { MembersList } from "@/features/workspaces/components/MembersList";

const WorkspaceMembersPage = async () => {
  const user = getAuthedUser();
  if (!user) redirect("/");

  return (
    <div className="w-full lg:max-w-xl">
      <MembersList />
    </div>
  );
};

export default WorkspaceMembersPage;
