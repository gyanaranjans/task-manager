import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useTaskStore } from "@/store/task-store";

export function SearchBar() {
  const { searchQuery, setSearchQuery } = useTaskStore();
  return (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search tasks..."
        className="pl-8 w-[300px]"
      />
    </div>
  );
}
