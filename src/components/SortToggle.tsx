import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { useTaskStore } from "@/store/task-store";

export function SortToggle() {
  const { sortConfig, toggleSortOrder } = useTaskStore();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleSortOrder}
      className="relative"
    >
      <ArrowUpDown className="h-4 w-4" />
      <span className="sr-only">
        Toggle sort{" "}
        {sortConfig.direction === "asc" ? "descending" : "ascending"}
      </span>
    </Button>
  );
}
