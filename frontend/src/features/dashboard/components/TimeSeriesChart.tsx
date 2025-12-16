import React, { useMemo } from "react";
import { format, parseISO } from "date-fns";
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
  onPointClick?: (payload: Record<string, any>) => void;
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

export function TimeSeriesChart({ title, series, valueFormatter, onPointClick }: TimeSeriesChartProps) {
  const { data, labels } = useMemo(() => mergeSeries(series), [series]);

  const formatValue = valueFormatter || ((v: number) => v);
  const formatDateLabel = (value: string) => {
    if (!value) return value;
    try {
      const parsed = parseISO(value);
      if (Number.isNaN(parsed.getTime())) return value;
      if (series.group === "day") return format(parsed, "dd/MM");
      if (series.group === "month") return format(parsed, "MM/yyyy");
      return format(parsed, "dd/MM/yyyy");
    } catch {
      return value;
    }
  };

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
          <LineChart
            data={data}
            margin={{ top: 8, right: 12, bottom: 4, left: 0 }}
            onClick={(evt: any) => {
              const payload = evt?.activePayload?.[0]?.payload;
              if (payload && onPointClick) {
                onPointClick(payload);
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.35)" />
            <XAxis
              dataKey="t"
              tick={{ fontSize: 12, fill: "currentColor" }}
              tickFormatter={(v: string) => formatDateLabel(v)}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "currentColor" }}
              tickFormatter={(v: number) => formatValue(v) as string}
            />
            <Tooltip
              formatter={(value: any) => [formatValue(value as number), ""]}
              labelFormatter={(label) => `${series.group}: ${formatDateLabel(label as string)}`}
            />
            <Legend />
            {labels.map((label, idx) => (
              <Line
                key={label}
                type="monotone"
                dataKey={label}
                stroke={palette[idx % palette.length]}
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
