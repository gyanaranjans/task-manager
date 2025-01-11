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
          handleStatusChange("OPEN");
          break;
        case "2":
          handleStatusChange("IN_PROGRESS");
          break;
        case "3":
          handleStatusChange("CLOSED");
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-4">
            <span>#{task.id}</span>
            <span className="flex-1">{task.name}</span>
            <Badge>{task.status}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
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
            <div className="text-sm text-muted-foreground">
              Assigned to {task.assignee}
            </div>
            <div className="text-sm text-muted-foreground">
              Due {format(new Date(task.due_date), "PPP")}
            </div>
          </div>

          {task.comment && (
            <div className="rounded-md bg-muted p-4">
              <p className="text-sm">{task.comment}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Last updated: {format(new Date(task.updated_at), "PPP")}
              </p>
            </div>
          )}

          <Textarea
            placeholder="Add a comment before changing status..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Use arrow keys to navigate between tasks
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => handleStatusChange("OPEN")}
                disabled={!comment.trim()}
              >
                Set Open (1)
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleStatusChange("IN_PROGRESS")}
                disabled={!comment.trim()}
              >
                Set In Progress (2)
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleStatusChange("CLOSED")}
                disabled={!comment.trim()}
              >
                Set Closed (3)
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
