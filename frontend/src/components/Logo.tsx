import { Scale } from "lucide-react";
import { cn } from "@/lib/utils";

type LogoVariant = "default" | "sidebar";
type LogoSize = "sm" | "md" | "lg";

interface LogoProps {
  showText?: boolean;
  variant?: LogoVariant;
  emblemSize?: LogoSize;
  className?: string;
}

const emblemSizeMap: Record<LogoSize, string> = {
  sm: "h-9 w-9",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

const iconSizeMap: Record<LogoSize, string> = {
  sm: "h-4.5 w-4.5",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export function Logo({
  showText = true,
  variant = "default",
  emblemSize = "md",
  className,
}: LogoProps) {
  const isSidebar = variant === "sidebar";

  const iconWrapperClasses = isSidebar
    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm shadow-sidebar-ring/40"
    : "bg-primary text-primary-foreground shadow-md shadow-primary/20";

  const titleClasses = isSidebar ? "text-sidebar-foreground" : "text-foreground";
  const subtitleClasses = isSidebar ? "text-sidebar-foreground/70" : "text-muted-foreground";

  return (
    <div className={cn("flex items-center gap-3 shrink-0", className)}>
      <div
        className={cn(
          "grid place-items-center rounded-2xl transition-all duration-200 shrink-0",
          emblemSizeMap[emblemSize],
          iconWrapperClasses
        )}
      >
        <Scale className={cn(iconSizeMap[emblemSize])} strokeWidth={2.2} />
      </div>

      {showText && (
        <div className="flex flex-col leading-tight text-left whitespace-normal max-w-[12rem]">
          <span className={cn("font-serif text-xl font-bold", titleClasses)}>SGA</span>
          <span className={cn("text-xs", subtitleClasses)}>Sistema de Gestao de Advocacias</span>
        </div>
      )}
    </div>
  );
}
