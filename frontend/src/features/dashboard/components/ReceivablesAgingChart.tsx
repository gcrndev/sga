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
import { AgingBar } from "../types";

type ReceivablesAgingChartProps = {
  data: AgingBar[];
  formatValue: (value: number) => string;
  onSelectBucket?: (bucket: string) => void;
};

export function ReceivablesAgingChart({ data, formatValue, onSelectBucket }: ReceivablesAgingChartProps) {
  if (!data.length) {
    return (
      <div className="border border-border rounded-lg p-4 bg-card">
        <div className="text-sm font-medium text-foreground mb-2">Contas a Receber por Faixa</div>
        <div className="text-sm text-muted-foreground">Sem dados</div>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-lg p-4 bg-card">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-sm font-medium text-foreground">Contas a Receber por Faixa</div>
          <div className="text-xs text-muted-foreground">Somente titulos em aberto</div>
        </div>
        <div className="text-xs text-muted-foreground">Atraso calculado em dias corridos</div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.35)" />
            <XAxis dataKey="faixa" tick={{ fontSize: 12, fill: "currentColor" }} />
            <YAxis
              tick={{ fontSize: 12, fill: "currentColor" }}
              tickFormatter={(v: number) => formatValue(v)}
            />
            <Tooltip formatter={(value: any) => [formatValue(value as number), ""]} />
            <Legend />
            <Bar
              dataKey="honorarios"
              name="Honorarios"
              stackId="aging"
              fill="#2563eb"
              radius={[4, 4, 0, 0]}
              onClick={({ payload }) => onSelectBucket?.((payload as AgingBar).faixa)}
            />
            <Bar
              dataKey="despesas"
              name="Despesas"
              stackId="aging"
              fill="#f59e0b"
              radius={[4, 4, 0, 0]}
              onClick={({ payload }) => onSelectBucket?.((payload as AgingBar).faixa)}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
