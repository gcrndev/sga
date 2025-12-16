import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { StatusCount } from "../types";

type ProcessStatusChartProps = {
  data: StatusCount[];
  onSelectStatus?: (status: string) => void;
};

export function ProcessStatusChart({ data, onSelectStatus }: ProcessStatusChartProps) {
  if (!data.length) {
    return (
      <div className="border border-border rounded-lg p-4 bg-card">
        <div className="text-sm font-medium text-foreground mb-2">Processos por Status</div>
        <div className="text-sm text-muted-foreground">Sem dados</div>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-lg p-4 bg-card">
      <div className="text-sm font-medium text-foreground mb-2">Processos por Status</div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 4, right: 12, bottom: 4, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.35)" />
            <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: "currentColor" }} />
            <YAxis
              type="category"
              dataKey="status"
              width={170}
              tick={{ fontSize: 12, fill: "currentColor" }}
            />
            <Tooltip formatter={(value: any) => [`${value}`, "Processos"]} />
            <Bar
              dataKey="quantidade"
              fill="#2563eb"
              radius={[0, 4, 4, 0]}
              onClick={({ payload }) => onSelectStatus?.((payload as StatusCount).status)}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
