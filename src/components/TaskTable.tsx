"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Task } from "@/types/tasks";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useTaskStore } from "@/store/task-store";

interface TaskTableProps {
  status: Task["status"];
}

export function TaskTable({ status }: TaskTableProps) {
  const { tasks, setSelectedTask, searchQuery, sortOrder } = useTaskStore();

  const filteredTasks = tasks
    .filter(
      (task) =>
        task.status === status &&
        task.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Priority</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Labels</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTasks.map((task) => (
            <TableRow
              key={task.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => setSelectedTask(task.id)}
            >
              <TableCell>
                <Badge
                  variant={task.priority === "HIGH" ? "destructive" : "default"}
                >
                  {task.priority}
                </Badge>
              </TableCell>
              <TableCell>#{task.id}</TableCell>
              <TableCell>{task.name}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {task.labels.map((label) => (
                    <Badge key={label} variant="outline">
                      {label}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                {format(new Date(task.due_date), "MMM dd, yyyy")}
              </TableCell>
              <TableCell>{task.assignee}</TableCell>
              <TableCell>
                {format(new Date(task.created_at), "MMM dd, yyyy")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
