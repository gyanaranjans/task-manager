import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { useTaskStore } from "@/store/task-store";

export function SortToggle() {
  const { toggleSortOrder } = useTaskStore();

  return (
    <Button variant="outline" size="icon" onClick={toggleSortOrder}>
      <ArrowUpDown className="h-4 w-4" />
    </Button>
  );
}
