"use client";
import { useEffect } from "react";
import { format } from "date-fns";
import { useTaskStore } from "@/store/task-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Status } from "@/types/tasks";

export function TaskModal() {
  const {
    tasks,
    selectedTaskId,
    comment,
    setSelectedTask,
    setComment,
    updateTaskStatus,
    getNextTask,
    getPreviousTask,
  } = useTaskStore();

  const task = tasks.find((t) => t.id === selectedTaskId);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!task) return;

      switch (e.key) {
        case "ArrowRight":
          const nextTask = getNextTask(task.id);
          if (nextTask) setSelectedTask(nextTask.id);
          break;
        case "ArrowLeft":
          const prevTask = getPreviousTask(task.id);
          if (prevTask) setSelectedTask(prevTask.id);
          break;
        case "1":
          if (comment.trim()) handleStatusChange("OPEN");
          break;
        case "2":
          if (comment.trim()) handleStatusChange("IN_PROGRESS");
          break;
        case "3":
          if (comment.trim()) handleStatusChange("CLOSED");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [task, comment]);

  const handleStatusChange = (newStatus: Status) => {
    if (!task || !comment.trim()) return;
    updateTaskStatus(task.id, newStatus, comment);
    setComment("");
  };

  if (!task) return null;

  return (
    <Dialog open={!!selectedTaskId} onOpenChange={() => setSelectedTask(null)}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between pr-8">
            <DialogTitle className="text-xl font-semibold">
              Task #{task.id}
            </DialogTitle>
            <Badge
              className="px-2 py-0.5 text-xs"
              variant={
                task.status === "OPEN"
                  ? "default"
                  : task.status === "IN_PROGRESS"
                  ? "secondary"
                  : "outline"
              }
            >
              {task.status}
            </Badge>
          </div>
          <h2 className="text-lg font-medium">{task.name}</h2>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={task.priority === "HIGH" ? "destructive" : "default"}
            >
              {task.priority}
            </Badge>
            {task.labels.map((label) => (
              <Badge key={label} variant="outline">
                {label}
              </Badge>
            ))}
          </div>

          <div className="grid gap-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium">Assignee:</span>
              <span>{task.assignee}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Due Date:</span>
              <span>{format(new Date(task.due_date), "PPP")}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Created:</span>
              <span>{format(new Date(task.created_at), "PPP")}</span>
            </div>
          </div>

          {task.comment && (
            <div className="rounded-lg bg-muted/50 p-4 space-y-2">
              <p className="text-sm">{task.comment}</p>
              <p className="text-xs text-muted-foreground">
                Last updated: {format(new Date(task.updated_at), "PPP")}
              </p>
            </div>
          )}

          <div className="space-y-4">
            <Textarea
              placeholder="Add a comment before changing status..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="resize-none"
            />

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Use arrow keys (←/→) to navigate between tasks
              </p>
              <div className="flex gap-2">
                <Button
                  variant={task.status === "OPEN" ? "default" : "secondary"}
                  onClick={() => handleStatusChange("OPEN")}
                  disabled={!comment.trim()}
                >
                  Open (1)
                </Button>
                <Button
                  variant={
                    task.status === "IN_PROGRESS" ? "default" : "secondary"
                  }
                  onClick={() => handleStatusChange("IN_PROGRESS")}
                  disabled={!comment.trim()}
                >
                  In Progress (2)
                </Button>
                <Button
                  variant={task.status === "CLOSED" ? "default" : "secondary"}
                  onClick={() => handleStatusChange("CLOSED")}
                  disabled={!comment.trim()}
                >
                  Closed (3)
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
