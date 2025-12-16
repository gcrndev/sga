import { addDays, formatISO, startOfDay } from "date-fns";
import { KpisResponse, Point, SeriesResponse } from "./types";

function createRng(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

function dateRange(from: Date, to: Date) {
  const days: Date[] = [];
  let current = startOfDay(from);
  const end = startOfDay(to);
  while (current <= end) {
    days.push(current);
    current = addDays(current, 1);
  }
  return days;
}

function buildSeries(
  from: string,
  to: string,
  seed: number,
  labels: Array<{ label: string; base: number; variance: number }>,
  monetary = false,
): SeriesResponse {
  const rng = createRng(seed);
  const days = dateRange(new Date(from), new Date(to));
  const series: SeriesResponse["series"] = labels.map((item, idx) => {
    const points: Point[] = days.map((d, dayIndex) => {
      const noise = rng() * item.variance - item.variance / 2;
      const trend = Math.sin((dayIndex / days.length) * Math.PI) * (item.variance / 2);
      const value = Math.max(monetary ? 100 : 0, Math.round(item.base + noise + trend));
      return { t: formatISO(d, { representation: "date" }), v: value };
    });
    return { label: item.label, points };
  });

  return {
    from,
    to,
    group: "day",
    series,
  };
}

export function mockDashboardKpis(from: string, to: string): KpisResponse {
  const clientsSeries = mockClientsSeries(from, to);
  const casesSeries = mockCasesSeries(from, to);
  const feesSeries = mockFeesSeries(from, to);

  const totalNewClients = clientsSeries.series
    .find((s) => s.label === "Novos")
    ?.points.reduce((sum, p) => sum + p.v, 0) ?? 0;
  const totalActiveClients = clientsSeries.series
    .find((s) => s.label === "Ativos")
    ?.points.reduce((sum, p) => sum + p.v, 0) ?? 0;
  const totalNewCases = casesSeries.series
    .find((s) => s.label === "Novos")
    ?.points.reduce((sum, p) => sum + p.v, 0) ?? 0;
  const totalActiveCases = casesSeries.series
    .find((s) => s.label === "Ativos")
    ?.points.reduce((sum, p) => sum + p.v, 0) ?? 0;
  const totalPendingCases = casesSeries.series
    .find((s) => s.label === "Pendentes")
    ?.points.reduce((sum, p) => sum + p.v, 0) ?? 0;
  const totalFees = feesSeries.series
    .find((s) => s.label === "Recebido")
    ?.points.reduce((sum, p) => sum + p.v, 0) ?? 0;

  return {
    clientes: {
      ativos: Math.round(totalActiveClients / daysInRange(from, to)),
      inativos: Math.round(totalActiveClients * 0.2),
      novos_mes: totalNewClients,
    },
    processos: {
      ativos: Math.round(totalActiveCases / daysInRange(from, to)),
      pendentes: Math.round(totalPendingCases / daysInRange(from, to)),
      novos_mes: totalNewCases,
    },
    honorarios: {
      recebido_mes: totalFees,
    },
  };
}

function daysInRange(from: string, to: string) {
  const start = startOfDay(new Date(from)).getTime();
  const end = startOfDay(new Date(to)).getTime();
  return Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1);
}

export function mockClientsSeries(from: string, to: string): SeriesResponse {
  return buildSeries(from, to, 42, [
    { label: "Novos", base: 8, variance: 5 },
    { label: "Ativos", base: 25, variance: 10 },
  ]);
}

export function mockCasesSeries(from: string, to: string): SeriesResponse {
  return buildSeries(from, to, 99, [
    { label: "Novos", base: 6, variance: 4 },
    { label: "Pendentes", base: 4, variance: 3 },
    { label: "Ativos", base: 14, variance: 6 },
  ]);
}

export function mockFeesSeries(from: string, to: string): SeriesResponse {
  return buildSeries(
    from,
    to,
    1337,
    [
      { label: "Recebido", base: 350, variance: 180 },
    ],
    true,
  );
}
