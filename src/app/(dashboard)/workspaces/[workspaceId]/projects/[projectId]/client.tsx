"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";

import { ProjectAvatar } from "@/features/projects/components/ProjectAvatar";
import { TaskViewSwitcher } from "@/features/tasks/components/TaskViewSwitcher";
import { useProjectId } from "@/features/projects/hooks/useProjectId";
import { useGetProject } from "@/features/projects/api/useGetProject";
import { PageLoader } from "@/components/page-loader";
import { PageError } from "@/components/page-error";
import { Button } from "@/components/ui/button";
import { useGetProjectAnalytics } from "@/features/projects/api/useGetProjectAnalytics";
import { Analytics } from "@/components/analytics/Analytics";

export const ProjectClient = () => {
  const projectId = useProjectId();

  const { data: project, isLoading: isLoadingProject } = useGetProject({
    projectId,
  });
  // TODO: Add isFetching to analytics and add skeleton loader
  const { data: analytics, isLoading: isLoadingAnalytics } =
    useGetProjectAnalytics({ projectId });

  const isLoading = isLoadingProject || isLoadingAnalytics;

  if (isLoading) {
    return <PageLoader />;
  }

  if (!project) {
    return <PageError message="Project not found" />;
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={project.name}
            image={project.imageUrl}
            className="size-8"
          />
          <p className="text-lg font-semibold">{project.name}</p>
        </div>
        <div>
          <Button variant="secondary" size="sm" asChild>
            <Link
              href={`/workspaces/${project.workspaceId}/projects/${project.$id}/settings`}
            >
              <Pencil />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>
      {analytics && <Analytics data={analytics} />}
      <TaskViewSwitcher hideProjectFilter />
    </div>
  );
};
