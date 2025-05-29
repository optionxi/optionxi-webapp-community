import { Search } from "lucide-react";
import { Input } from "../ui/input";

// Search Bar Function
export default function CustSearchBar({ search, setSearch }: { search: string, setSearch: (value: string) => void }) {
  return (
<div className="relative w-full">
  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search stocks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-lg bg-background pl-8"
      />
    </div>
  );
}
