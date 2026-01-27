import { LoaderIcon } from "lucide-react";
import { cn } from "~/lib/utils";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("size-36 animate-spin opacity-50", className)}
      {...props}
    />
  );
}

export function BackgroundSpinner() {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs",
      )}
    >
      <Spinner />
    </div>
  );
}
