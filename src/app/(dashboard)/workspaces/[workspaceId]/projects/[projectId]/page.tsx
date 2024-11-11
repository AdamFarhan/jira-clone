import { redirect } from "next/navigation";
import Link from "next/link";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";

import { getAuthedUser } from "@/features/auth/queries";
import { getProject } from "@/features/projects/queries";
import { ProjectAvatar } from "@/features/projects/components/ProjectAvatar";
import { TaskViewSwitcher } from "@/features/tasks/components/TaskViewSwitcher";

interface Props {
  params: {
    projectId: string;
  };
}
const ProjectPage = async ({ params }: Props) => {
  const user = getAuthedUser();
  if (!user) redirect("/sign-in");

  const initialValues = await getProject({ projectId: params.projectId });

  if (!initialValues) {
    throw new Error("Project not found");
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={initialValues.name}
            image={initialValues.imageUrl}
            className="size-8"
          />
          <p className="text-lg font-semibold">{initialValues.name}</p>
        </div>
        <div>
          <Button variant="secondary" size="sm" asChild>
            <Link
              href={`/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}/settings`}
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

export default ProjectPage;
