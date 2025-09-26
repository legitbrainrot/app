import { AlertTriangle, Ban, RefreshCw, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ErrorStateProps = {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  type?: "error" | "network" | "forbidden" | "not-found";
  className?: string;
};

export function ErrorState({
  title,
  description,
  action,
  type = "error",
  className,
}: ErrorStateProps) {
  const config = {
    error: {
      icon: AlertTriangle,
      title: title || "Something went wrong",
      description:
        description || "An unexpected error occurred. Please try again.",
      color: "text-destructive",
    },
    network: {
      icon: WifiOff,
      title: title || "Connection Error",
      description:
        description ||
        "Unable to connect. Please check your internet connection.",
      color: "text-orange-500",
    },
    forbidden: {
      icon: Ban,
      title: title || "Access Denied",
      description:
        description || "You don't have permission to access this resource.",
      color: "text-red-500",
    },
    "not-found": {
      icon: AlertTriangle,
      title: title || "Not Found",
      description:
        description || "The resource you're looking for doesn't exist.",
      color: "text-yellow-500",
    },
  };

  const {
    icon: Icon,
    title: defaultTitle,
    description: defaultDescription,
    color,
  } = config[type];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12",
        className,
      )}
    >
      <div
        className={cn(
          "mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted",
          color,
        )}
      >
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="mb-2 font-semibold text-lg">{defaultTitle}</h3>
      <p className="mb-6 max-w-md text-center text-muted-foreground">
        {defaultDescription}
      </p>
      {action && (
        <Button className="btn-primary" onClick={action.onClick}>
          <RefreshCw className="mr-2 h-4 w-4" />
          {action.label}
        </Button>
      )}
    </div>
  );
}

interface ErrorCardProps extends ErrorStateProps {
  showCard?: boolean;
}

export function ErrorCard({ showCard = true, ...props }: ErrorCardProps) {
  if (!showCard) {
    return <ErrorState {...props} />;
  }

  return (
    <Card>
      <CardContent>
        <ErrorState {...props} />
      </CardContent>
    </Card>
  );
}
