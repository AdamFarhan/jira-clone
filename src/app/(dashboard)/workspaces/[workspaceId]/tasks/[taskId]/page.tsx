import { getAuthedUser } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import { TaskPageClient } from "./client";

const TaskPage = async () => {
  const user = await getAuthedUser();
  if (!user) redirect("/sign-in");

  return <TaskPageClient />;
};

export default TaskPage;