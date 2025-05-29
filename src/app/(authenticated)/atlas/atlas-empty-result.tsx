import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface EmptyStateProps {
  message?: string;
  onReset?: () => void;
  showResetButton?: boolean;
}

export default function EmptyState({ 
  message = "No signals found for the selected filters", 
  onReset,
  showResetButton = true 
}: EmptyStateProps) {
  return (
    <Card className="w-full p-12 flex flex-col items-center justify-center text-center space-y-6">
      <div className="rounded-full bg-muted p-4">
        <SearchX className="h-12 w-12 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-semibold">No results found</h3>
        <p className="text-muted-foreground">
          {message}
        </p>
      </div>
      {showResetButton && onReset && (
        <Button onClick={onReset} variant="outline">
          Reset filters
        </Button>
      )}
    </Card>
  );
}