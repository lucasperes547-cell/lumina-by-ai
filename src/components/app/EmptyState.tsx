import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = "",
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-surface border border-dashed border-border rounded-3xl px-6 py-12 text-center ${className}`}
    >
      <div className="size-14 mx-auto mb-4 rounded-2xl bg-primary/10 grid place-items-center">
        <Icon className="size-6 text-primary" />
      </div>
      <h3 className="font-bold text-base mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mx-auto">{description}</p>
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}