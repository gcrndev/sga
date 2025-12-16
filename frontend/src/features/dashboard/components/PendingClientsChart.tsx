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
import { PendingClient } from "../types";

type PendingClientsChartProps = {
  data: PendingClient[];
  onSelectClient?: (client: PendingClient) => void;
};

export function PendingClientsChart({ data, onSelectClient }: PendingClientsChartProps) {
  if (!data.length) {
    return (
      <div className="border border-border rounded-lg p-4 bg-card">
        <div className="text-sm font-medium text-foreground mb-2">Clientes com Pendencias</div>
        <div className="text-sm text-muted-foreground">Sem dados</div>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-lg p-4 bg-card">
      <div className="flex items-center justify-between mb-2 gap-2">
        <div className="flex flex-col">
          <div className="text-sm font-medium text-foreground">Clientes com Pendencias</div>
          <div className="text-xs text-muted-foreground">Top 10 · Sem movimentacao acima do limite</div>
        </div>
        <div className="text-xs text-muted-foreground">Responsabilidade do escritorio</div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 8, right: 12, bottom: 4, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.35)" />
            <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: "currentColor" }} />
            <YAxis
              type="category"
              dataKey="cliente"
              width={180}
              tick={{ fontSize: 12, fill: "currentColor" }}
            />
            <Tooltip formatter={(value: any, _name: string, payload: any) => [`${value}`, `Sem mov.: ${payload.payload.dias_sem_movimentacao}d`]} />
            <Bar
              dataKey="processos"
              fill="#0ea5e9"
              radius={[0, 4, 4, 0]}
              onClick={({ payload }) => onSelectClient?.(payload as PendingClient)}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
