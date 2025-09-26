import { cn } from "@/lib/utils";

type LoadingSpinnerProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function LoadingSpinner({
  size = "md",
  className,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-muted border-t-primary",
        sizeClasses[size],
        className,
      )}
    />
  );
}

type LoadingStateProps = {
  title?: string;
  description?: string;
  className?: string;
};

export function LoadingState({
  title = "Loading...",
  description,
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12",
        className,
      )}
    >
      <LoadingSpinner className="mb-4" size="lg" />
      <h3 className="mb-1 font-semibold text-lg">{title}</h3>
      {description && (
        <p className="text-center text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

type LoadingSkeletonProps = {
  className?: string;
};

export function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} />;
}

export function TradeCardSkeleton() {
  return (
    <div className="space-y-4 rounded-lg border border-border p-6">
      <LoadingSkeleton className="h-32 w-full" />
      <LoadingSkeleton className="h-5 w-3/4" />
      <LoadingSkeleton className="h-4 w-1/2" />
      <div className="flex items-center justify-between">
        <LoadingSkeleton className="h-6 w-20" />
        <LoadingSkeleton className="h-9 w-24" />
      </div>
    </div>
  );
}
