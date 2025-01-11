"use client";
import { TaskTable } from "@/components/TaskTable";
import { SearchBar } from "@/components/SearchBar";
import { SortToggle } from "@/components/SortToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskModal } from "@/components/TaskModal";
import { NewTaskModal } from "@/components/NewTaskModal";
import { useTaskStore } from "@/store/task-store";

export default function Home() {
  const { tasks } = useTaskStore();
  const counts = {
    open: tasks.filter((t) => t.status === "OPEN").length,
    inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    closed: tasks.filter((t) => t.status === "CLOSED").length,
  };
  return (
    <div className="container mx-auto py-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Task Manager</h1>
        <NewTaskModal />
        <div className="flex space-x-4">
          <SearchBar />
          <SortToggle />
        </div>
      </header>

      <Tabs defaultValue="open" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="open">Open ({counts.open})</TabsTrigger>
          <TabsTrigger value="in-progress">
            In Progress ({counts.inProgress})
          </TabsTrigger>
          <TabsTrigger value="closed">Closed ({counts.closed})</TabsTrigger>
        </TabsList>

        <TabsContent value="open">
          <TaskTable status="OPEN" />
        </TabsContent>
        <TabsContent value="in-progress">
          <TaskTable status="IN_PROGRESS" />
        </TabsContent>
        <TabsContent value="closed">
          <TaskTable status="CLOSED" />
        </TabsContent>
      </Tabs>

      <TaskModal />
    </div>
  );
}
