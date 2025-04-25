
import { cn } from "@/lib/utils";

interface AdminFormContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function AdminFormContainer({ children, className }: AdminFormContainerProps) {
  return (
    <div className={cn(
      "w-full max-w-2xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6",
      className
    )}>
      {children}
    </div>
  );
}

export function AdminFormSection({ children, className }: AdminFormContainerProps) {
  return (
    <div className={cn(
      "space-y-4 bg-card p-4 sm:p-6 rounded-lg border shadow-sm",
      className
    )}>
      {children}
    </div>
  );
}

export function AdminFormTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl sm:text-2xl font-semibold text-center sm:text-left mb-4">
      {children}
    </h2>
  );
}

