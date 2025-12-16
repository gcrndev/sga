import React, { useMemo } from "react";
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { SeriesResponse } from "../types";

type TimeSeriesChartProps = {
  title: string;
  series: SeriesResponse;
  valueFormatter?: (value: number) => string | number;
};

const palette = [
  "#2563eb",
  "#fbbf24",
  "#22c55e",
  "#ec4899",
  "#06b6d4",
  "#a855f7",
];

function mergeSeries(series: SeriesResponse) {
  const labels = series.series.map((s) => s.label);
  const rows: Record<string, any> = {};

  series.series.forEach((line) => {
    line.points.forEach((p) => {
      if (!rows[p.t]) {
        rows[p.t] = { t: p.t };
      }
      rows[p.t][line.label] = p.v;
    });
  });

  const data = Object.values(rows).sort((a, b) => (a.t < b.t ? -1 : 1));
  return { data, labels };
}

export function TimeSeriesChart({ title, series, valueFormatter }: TimeSeriesChartProps) {
  const { data, labels } = useMemo(() => mergeSeries(series), [series]);

  const formatValue = valueFormatter || ((v: number) => v);

  if (!labels.length) {
    return (
      <div className="border border-border rounded-lg p-4 bg-card">
        <div className="text-sm font-medium text-foreground mb-2">{title}</div>
        <div className="text-sm text-muted-foreground">Sem dados</div>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-lg p-4 bg-card">
      <div className="text-sm font-medium text-foreground mb-2">{title}</div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.35)" />
            <XAxis dataKey="t" tick={{ fontSize: 12, fill: "currentColor" }} />
            <YAxis tick={{ fontSize: 12, fill: "currentColor" }} />
            <Tooltip
              formatter={(value: any) => [formatValue(value as number), ""]}
              labelFormatter={(label) => `${series.group}: ${label}`}
            />
            <Legend />
            {labels.map((label, idx) => (
              <Line
                key={label}
                type="monotone"
                dataKey={label}
                stroke={palette[idx % palette.length]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
