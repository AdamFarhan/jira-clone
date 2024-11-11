"use client";
import { useQueryState } from "nuqs";
import { Loader, Plus } from "lucide-react";
import { useCallback } from "react";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkspaceId } from "@/features/workspaces/hooks/useWorkspaceId";

import { useCreateTaskModal } from "../hooks/useCreateTaskModal";
import { useGetTasks } from "../api/useGetTasks";
import { DataFilters } from "./DataFilters";
import { useTaskFilters } from "../hooks/useTaskFilters";
import { DataTable } from "./data-table/data-table";
import { columns } from "./data-table/columns";
import { KanbanBoard } from "./kanban/KanbanBoard";
import { TaskStatus } from "../types";
import { useBulkUpdateTasks } from "../api/useBulkUpdateTasks";
import { TasksCalendar } from "./tasks-calendar/TasksCalendar";

interface Props {
  hideProjectFilter?: boolean;
}

export const TaskViewSwitcher = ({ hideProjectFilter }: Props) => {
  const [{ status, assigneeId, projectId, dueDate, search }] = useTaskFilters();

  const [view, setView] = useQueryState("task-view", {
    defaultValue: "kanban",
  });
  const workspaceId = useWorkspaceId();
  const { open } = useCreateTaskModal();

  const { mutate: bulkUpdate } = useBulkUpdateTasks();
  const { data: tasks, isLoading } = useGetTasks({
    workspaceId,
    status,
    assigneeId,
    projectId,
    dueDate,
    search,
  });

  const onKanbanChange = useCallback(
    (tasks: { $id: string; status: TaskStatus; position: number }[]) => {
      console.log({ tasks });
      bulkUpdate({
        json: { tasks },
      });
    },
    [bulkUpdate]
  );

  return (
    <Tabs
      className="flex-1 w-full border rounded-lg"
      defaultValue={view}
      onValueChange={setView}
    >
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
              Kanban
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              Table
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="calendar">
              Calendar
            </TabsTrigger>
          </TabsList>
          <Button size="sm" className="w-full lg:w-auto" onClick={open}>
            <Plus />
            New
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <DataFilters hideProjectFilter={hideProjectFilter} />
        <DottedSeparator className="my-4" />
        {isLoading ? (
          <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
            <Loader className="animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="mt-0">
              <DataTable columns={columns} data={tasks?.documents ?? []} />
            </TabsContent>
            <TabsContent value="kanban" className="mt-0">
              <KanbanBoard
                data={tasks?.documents ?? []}
                onChange={onKanbanChange}
              />
            </TabsContent>
            <TabsContent value="calendar" className="mt-0 h-full pb-4">
              <TasksCalendar data={tasks?.documents ?? []} />
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};
