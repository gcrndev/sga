import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { TasksStatusResponse } from "../types";

type TasksStatusChartProps = {
  data: TasksStatusResponse;
  onSelectStatus?: (status: string) => void;
};

export function TasksStatusChart({ data, onSelectStatus }: TasksStatusChartProps) {
  const hasData = data.items.length > 0;

  return (
    <div className="border border-border rounded-lg p-4 bg-card">
      <div className="flex items-center justify-between mb-2 gap-2">
        <div className="flex flex-col">
          <div className="text-sm font-medium text-foreground">Tarefas por Status</div>
          <div className="text-xs text-muted-foreground">Inclui tarefas vinculadas ou nao a processos</div>
        </div>
        <Badge variant="secondary" className="bg-destructive/10 text-destructive border-destructive/30">
          Vencidas: {data.totalVencidas}
        </Badge>
      </div>
      {!hasData ? (
        <div className="text-sm text-muted-foreground">Sem dados</div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.items} margin={{ top: 8, right: 12, bottom: 4, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.35)" />
              <XAxis dataKey="status" tick={{ fontSize: 12, fill: "currentColor" }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "currentColor" }} />
              <Tooltip
                formatter={(value: any, name: string) => [`${value}`, name === "vencidas" ? "Vencidas" : "No prazo"]}
              />
              <Legend />
              <Bar
                dataKey="no_prazo"
                name="No prazo"
                stackId="tarefas"
                fill="#22c55e"
                radius={[4, 4, 0, 0]}
                onClick={({ payload }) => onSelectStatus?.((payload as any).status)}
              />
              <Bar
                dataKey="vencidas"
                name="Vencidas"
                stackId="tarefas"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
                onClick={({ payload }) => onSelectStatus?.((payload as any).status)}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
