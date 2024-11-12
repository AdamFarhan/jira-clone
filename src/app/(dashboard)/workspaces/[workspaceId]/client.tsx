"use client";

import { useGetTasks } from "@/features/tasks/api/useGetTasks";
import { useGetMembers } from "@/features/members/api/useGetMembers";
import { useGetProjects } from "@/features/projects/api/useGetProjects";
import { useWorkspaceId } from "@/features/workspaces/hooks/useWorkspaceId";
import { useGetWorkspaceAnalytics } from "@/features/workspaces/api/useGetWorkspaceAnalytics";

import { PageLoader } from "@/components/page-loader";
import { PageError } from "@/components/page-error";
import { Analytics } from "@/components/analytics/Analytics";
import { TaskList } from "@/features/workspaces/components/LandingLists/TaskList";
import { ProjectList } from "@/features/workspaces/components/LandingLists/ProjectList";
import { MemberList } from "@/features/workspaces/components/LandingLists/MemberList";

export const WorkspaceIdClient = () => {
  const workspaceId = useWorkspaceId();

  const { data: analytics, isLoading: isAnalyticsLoading } =
    useGetWorkspaceAnalytics({ workspaceId });
  const { data: tasks, isLoading: isTasksLoading } = useGetTasks({
    workspaceId,
  });
  const { data: projects, isLoading: isProjectsLoading } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isMembersLoading } = useGetMembers({
    workspaceId,
  });

  const isLoading =
    isAnalyticsLoading ||
    isTasksLoading ||
    isProjectsLoading ||
    isMembersLoading;

  if (isLoading) {
    return <PageLoader />;
  }

  if (!analytics || !tasks || !projects || !members) {
    return <PageError message="Failed to load workspace data" />;
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      <Analytics data={analytics} />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <TaskList tasks={tasks.documents} total={tasks.total} />
        <ProjectList projects={projects.documents} total={projects.total} />
        <MemberList members={members.documents} total={members.total} />
      </div>
    </div>
  );
};
