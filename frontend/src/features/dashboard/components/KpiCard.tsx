import React from "react";

type KpiCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
};

export function KpiCard({ title, value, subtitle }: KpiCardProps) {
  return (
    <div className="border border-border rounded-lg p-4 bg-card shadow-sm">
      <div className="text-sm text-muted-foreground font-medium">{title}</div>
      <div className="mt-1 text-3xl font-bold font-serif text-foreground">{value}</div>
      {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
    </div>
  );
}
