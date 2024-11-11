"use client";

import { DottedSeparator } from "@/components/dotted-separator";
import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { useGetTask } from "@/features/tasks/api/useGetTask";
import { TaskDescription } from "@/features/tasks/components/task-description/TaskDescription";
import { TaskOverview } from "@/features/tasks/components/task-overview/TaskOverview";
import { TaskBreadcrumbs } from "@/features/tasks/components/TaskBreadcrumbs";
import { useTaskId } from "@/features/tasks/hooks/useTaskId";

export const TaskPageClient = () => {
  const taskId = useTaskId();
  const { data, isLoading } = useGetTask({ taskId });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!data) {
    return <PageError message="Task not found" />;
  }
  return (
    <div className="flex flex-col">
      <TaskBreadcrumbs project={data.project} task={data} />
      <DottedSeparator className="my-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaskOverview task={data} />
        <TaskDescription task={data} />
      </div>
    </div>
  );
};
