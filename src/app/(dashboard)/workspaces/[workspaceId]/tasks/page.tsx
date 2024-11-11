import { redirect } from "next/navigation";

import { getAuthedUser } from "@/features/auth/queries";
import { TaskViewSwitcher } from "@/features/tasks/components/TaskViewSwitcher";

const TasksPage = async () => {
  const user = getAuthedUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="h-full flex flex-col">
      <TaskViewSwitcher />
    </div>
  );
};

export default TasksPage;
