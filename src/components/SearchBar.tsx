import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useTaskStore } from "@/store/task-store";
import { Task } from "@/types/tasks";

const SEARCHABLE_COLUMNS: { label: string; value: keyof Task }[] = [
  { label: "Name", value: "name" },
  { label: "Priority", value: "priority" },
  { label: "Assignee", value: "assignee" },
  { label: "Labels", value: "labels" },
];

export function SearchBar() {
  const { searchConfig, setSearchConfig } = useTaskStore();

  return (
    <div className="flex items-center gap-2">
      <Select
        value={searchConfig.column}
        onValueChange={(value: keyof Task) =>
          setSearchConfig({ ...searchConfig, column: value })
        }
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Select column" />
        </SelectTrigger>
        <SelectContent>
          {SEARCHABLE_COLUMNS.map((column) => (
            <SelectItem key={column.value} value={column.value}>
              {column.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        className="w-[200px]"
        placeholder={`Search by ${searchConfig.column}...`}
        value={searchConfig.query}
        onChange={(e) =>
          setSearchConfig({ ...searchConfig, query: e.target.value })
        }
      />
    </div>
  );
}
