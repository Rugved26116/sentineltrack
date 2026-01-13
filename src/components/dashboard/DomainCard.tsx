import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Domain = "academic" | "health" | "finance" | "reflection";

interface DomainCardProps {
  domain: Domain;
  title: string;
  icon: ReactNode;
  status: "good" | "warning" | "bad";
  statusText: string;
  description: string;
  metric?: string;
  metricLabel?: string;
  href: string;
}

const domainStyles = {
  academic: {
    card: "domain-card-academic",
    gradient: "text-gradient-academic",
    iconBg: "bg-academic-muted",
    iconColor: "text-academic",
  },
  health: {
    card: "domain-card-health",
    gradient: "text-gradient-health",
    iconBg: "bg-health-muted",
    iconColor: "text-health",
  },
  finance: {
    card: "domain-card-finance",
    gradient: "text-gradient-finance",
    iconBg: "bg-finance-muted",
    iconColor: "text-finance",
  },
  reflection: {
    card: "domain-card-reflection",
    gradient: "text-gradient-reflection",
    iconBg: "bg-reflection-muted",
    iconColor: "text-reflection",
  },
};

const statusStyles = {
  good: "status-good",
  warning: "status-warning",
  bad: "status-bad",
};

export function DomainCard({
  domain,
  title,
  icon,
  status,
  statusText,
  description,
  metric,
  metricLabel,
  href,
}: DomainCardProps) {
  const styles = domainStyles[domain];

  return (
    <Link to={href} className="block">
      <div className={cn(styles.card, "group")}>
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className={cn("rounded-xl p-3", styles.iconBg)}>
            <div className={styles.iconColor}>{icon}</div>
          </div>
          <span className={statusStyles[status]}>
            <span className="relative flex h-2 w-2">
              <span
                className={cn(
                  "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                  status === "good"
                    ? "bg-status-good"
                    : status === "warning"
                    ? "bg-status-warning"
                    : "bg-status-bad"
                )}
              />
              <span
                className={cn(
                  "relative inline-flex h-2 w-2 rounded-full",
                  status === "good"
                    ? "bg-status-good"
                    : status === "warning"
                    ? "bg-status-warning"
                    : "bg-status-bad"
                )}
              />
            </span>
            {statusText}
          </span>
        </div>

        {/* Title */}
        <h3 className={cn("mb-2 text-xl font-semibold", styles.gradient)}>
          {title}
        </h3>

        {/* Description */}
        <p className="mb-4 text-sm text-muted-foreground">{description}</p>

        {/* Metric */}
        {metric && (
          <div className="mb-4">
            <span className="text-3xl font-bold tracking-tight text-foreground">
              {metric}
            </span>
            {metricLabel && (
              <span className="ml-2 text-sm text-muted-foreground">
                {metricLabel}
              </span>
            )}
          </div>
        )}

        {/* Action */}
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
          View details
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
