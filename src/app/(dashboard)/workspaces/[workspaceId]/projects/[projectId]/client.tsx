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

export const ProjectClient = () => {
  const projectId = useProjectId();

  const { data, isLoading } = useGetProject({ projectId });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!data) {
    return <PageError message="Project not found" />;
  }
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={data.name}
            image={data.imageUrl}
            className="size-8"
          />
          <p className="text-lg font-semibold">{data.name}</p>
        </div>
        <div>
          <Button variant="secondary" size="sm" asChild>
            <Link
              href={`/workspaces/${data.workspaceId}/projects/${data.$id}/settings`}
            >
              <Pencil />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>
      <TaskViewSwitcher hideProjectFilter />
    </div>
  );
};
