import Link from "next/link";
import { ChevronRight, Trash } from "lucide-react";

import { Project } from "@/features/projects/types";
import { ProjectAvatar } from "@/features/projects/components/ProjectAvatar";
import { useWorkspaceId } from "@/features/workspaces/hooks/useWorkspaceId";
import { Button } from "@/components/ui/button";

import { Task } from "../types";
import { useDeleteTask } from "../api/useDeleteTask";
import { useConfirm } from "@/hooks/useConfirm";
import { useRouter } from "next/navigation";

interface Props {
  project: Project;
  task: Task;
}

export const TaskBreadcrumbs = ({ project, task }: Props) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const { mutate, isPending } = useDeleteTask();
  const [ConfirmDialog, confirm] = useConfirm({
    title: "Delete task",
    message: "This action cannot be undone",
    variant: "destructive",
  });

  const handleDelete = async () => {
    const ok = await confirm();
    if (!ok) return;

    mutate(
      { param: { taskId: task.$id } },
      {
        onSuccess: () => {
          router.push(`/workspaces/${workspaceId}/tasks`);
        },
      }
    );
  };

  return (
    <div className="flex items-center gap-x-2">
      <ConfirmDialog />
      <ProjectAvatar
        name={project.name}
        image={project.imageUrl}
        className="size-6 lg:size-8"
      />
      <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
        <p className="text-sm lg:text-lg font-semibold text-muted-foreground hover:opacity-75 transition">
          {project.name}
        </p>
      </Link>
      <ChevronRight className="size-4 lg:size-5 text-muted-foreground" />
      <p className="text-sm lg:text-lg font-semibold">{task.name}</p>
      <Button
        className="ml-auto"
        variant={"destructive"}
        size="sm"
        onClick={handleDelete}
        disabled={isPending}
      >
        <Trash />
        <span className="hidden lg:block">Delete Task</span>
      </Button>
    </div>
  );
};
