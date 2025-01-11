"use client";
import { useState, useEffect, useRef } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ChevronDown, ArrowUpDown } from "lucide-react";

const COLUMNS: { label: string; value: keyof Task; width?: string }[] = [
  { label: "Priority", value: "priority", width: "100px" },
  { label: "ID", value: "id", width: "80px" },
  { label: "Name", value: "name" },
  { label: "Labels", value: "labels" },
  { label: "Due Date", value: "due_date", width: "120px" },
  { label: "Assignee", value: "assignee", width: "200px" },
  { label: "Created", value: "created_at", width: "120px" },
];

interface TaskTableProps {
  status: Task["status"];
}

export function TaskTable({ status }: TaskTableProps) {
  const {
    tasks,
    setSelectedTask,
    searchConfig,
    sortConfig,
    setSortConfig,
    setSearchConfig,
    loadMore,
  } = useTaskStore();

  const sortData = (a: Task, b: Task) => {
    const column = sortConfig.column;
    const direction = sortConfig.direction === "asc" ? 1 : -1;

    if (
      column === "created_at" ||
      column === "due_date" ||
      column === "updated_at"
    ) {
      return (
        (new Date(a[column]).getTime() - new Date(b[column]).getTime()) *
        direction
      );
    }

    return String(a[column]).localeCompare(String(b[column])) * direction;
  };

  const filterData = (task: Task) => {
    if (!searchConfig.query) return true;

    const value = task[searchConfig.column];
    const search = searchConfig.query.toLowerCase();

    if (Array.isArray(value)) {
      return value.some((v) => v.toLowerCase().includes(search));
    }

    return String(value).toLowerCase().includes(search);
  };

  const filteredTasks = tasks
    .filter((task) => task.status === status)
    .filter(filterData)
    .sort(sortData);

  const handleSort = (column: keyof Task) => {
    setSortConfig({
      column,
      direction:
        sortConfig.column === column && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredTasks.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === "Enter" && selectedIndex !== -1) {
        setSelectedTask(filteredTasks[selectedIndex].id);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, filteredTasks]);

  // Add intersection observer for infinite scroll
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loadMore]);
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {COLUMNS.map((column) => (
              <TableHead key={column.value}>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2">
                    {column.label}
                    <ChevronDown className="h-4 w-4" />
                    {sortConfig.column === column.value && (
                      <ArrowUpDown className="h-4 w-4 ml-auto" />
                    )}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleSort(column.value)}>
                      Sort{" "}
                      {sortConfig.direction === "asc"
                        ? "Descending"
                        : "Ascending"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        setSearchConfig({ column: column.value, query: "" })
                      }
                    >
                      Filter by {column.label}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTasks.map((task, index) => (
            <TableRow
              key={task.id}
              className={cn(
                "cursor-pointer transition-colors",
                "hover:bg-muted/50",
                selectedIndex === index &&
                  "bg-muted border-l-2 border-l-primary",
                "focus-visible:bg-muted focus-visible:outline-none"
              )}
              onClick={() => {
                setSelectedIndex(index);
                setSelectedTask(task.id);
              }}
              tabIndex={0}
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
