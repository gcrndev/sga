import { addDays, differenceInCalendarDays, format, formatISO, startOfDay, subMonths } from "date-fns";
import {
  AgingBar,
  KpisResponse,
  PendingClient,
  Point,
  SeriesResponse,
  StatusCount,
  TasksStatusResponse,
} from "./types";

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
  const series: SeriesResponse["series"] = labels.map((item) => {
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

function sumSeriesPoints(series: SeriesResponse, label: string) {
  return series.series
    .find((s) => s.label === label)
    ?.points.reduce((sum, p) => sum + p.v, 0) ?? 0;
}

function daysInRange(from: string, to: string) {
  const start = startOfDay(new Date(from)).getTime();
  const end = startOfDay(new Date(to)).getTime();
  return Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1);
}

function generateInvoices(count: number, rng: () => number, reference: Date) {
  const invoices: Array<{
    dueDate: Date;
    valor: number;
    status: "em_aberto" | "pago";
    categoria: "honorarios" | "despesas";
  }> = [];

  for (let i = 0; i < count; i++) {
    const status: "em_aberto" | "pago" = rng() > 0.2 ? "em_aberto" : "pago";
    const categoria: "honorarios" | "despesas" = rng() > 0.25 ? "honorarios" : "despesas";
    const offset = Math.floor(rng() * 120) - 30; // 30 days before to 90 days after
    const dueDate = addDays(reference, offset);
    const base = categoria === "honorarios" ? 1200 : 450;
    const valor = Math.max(80, Math.round(base + (rng() - 0.5) * base * 0.6));
    invoices.push({ dueDate, valor, status, categoria });
  }

  return invoices;
}

export function mockDashboardKpis(from: string, to: string, tenantId: number): KpisResponse {
  const clientsSeries = mockClientsSeries(from, to, tenantId);
  const feesSeries = mockFeesSeries(from, to, tenantId);
  const tasksStatus = mockTasksStatus(from, to, tenantId);
  const aging = mockReceivablesAging(from, to, tenantId);

  const totalReceber = aging.reduce((sum, bucket) => sum + bucket.total, 0);
  const totalRecebido = sumSeriesPoints(feesSeries, "Recebido");
  const activeClients = Math.round(sumSeriesPoints(clientsSeries, "Ativos") / daysInRange(from, to));
  const inactiveClients = Math.max(2, Math.round(activeClients * 0.25));

  return {
    financeiro: {
      total_a_receber: totalReceber,
      total_recebido_periodo: totalRecebido,
    },
    clientes: {
      ativos: activeClients,
      inativos: inactiveClients,
    },
    tarefas: {
      vencidas: tasksStatus.totalVencidas,
    },
  };
}

export function mockClientsSeries(from: string, to: string, tenantId: number): SeriesResponse {
  return buildSeries(from, to, 42 + tenantId, [
    { label: "Novos", base: 8, variance: 5 },
    { label: "Ativos", base: 26, variance: 12 },
  ]);
}

export function mockCasesSeries(from: string, to: string, tenantId: number): SeriesResponse {
  return buildSeries(from, to, 99 + tenantId, [
    { label: "Novos", base: 6, variance: 4 },
    { label: "Pendentes", base: 5, variance: 3 },
    { label: "Ativos", base: 15, variance: 7 },
  ]);
}

export function mockFeesSeries(from: string, to: string, tenantId: number): SeriesResponse {
  return buildSeries(
    from,
    to,
    1337 + tenantId,
    [
      { label: "Recebido", base: 420, variance: 220 },
    ],
    true,
  );
}

export function mockReceivablesAging(from: string, to: string, tenantId: number): AgingBar[] {
  const reference = startOfDay(new Date(to));
  const rng = createRng(77 + tenantId);
  const invoices = generateInvoices(48 + Math.floor(rng() * 12), rng, reference);

  const buckets: Record<string, { honorarios: number; despesas: number }> = {
    "A vencer": { honorarios: 0, despesas: 0 },
    "1-7 dias": { honorarios: 0, despesas: 0 },
    "8-30 dias": { honorarios: 0, despesas: 0 },
    "31-60 dias": { honorarios: 0, despesas: 0 },
    "60+ dias": { honorarios: 0, despesas: 0 },
  };

  invoices.forEach((invoice) => {
    if (invoice.status !== "em_aberto") return;
    const diasAtraso = differenceInCalendarDays(reference, invoice.dueDate);
    let faixa = "A vencer";

    if (diasAtraso >= 60) {
      faixa = "60+ dias";
    } else if (diasAtraso >= 31) {
      faixa = "31-60 dias";
    } else if (diasAtraso >= 8) {
      faixa = "8-30 dias";
    } else if (diasAtraso >= 1) {
      faixa = "1-7 dias";
    }

    buckets[faixa][invoice.categoria === "honorarios" ? "honorarios" : "despesas"] += invoice.valor;
  });

  return Object.keys(buckets).map((faixa) => {
    const honorarios = Math.round(buckets[faixa].honorarios);
    const despesas = Math.round(buckets[faixa].despesas);
    return {
      faixa,
      honorarios,
      despesas,
      total: honorarios + despesas,
    };
  });
}

export function mockBillingVsPaymentsSeries(tenantId: number, months = 12): SeriesResponse {
  const now = startOfDay(new Date());
  const monthsRange: Date[] = [];
  for (let i = months - 1; i >= 0; i--) {
    monthsRange.push(subMonths(now, i));
  }

  const rng = createRng(501 + tenantId);
  const faturado: Point[] = [];
  const recebido: Point[] = [];

  monthsRange.forEach((d, idx) => {
    const label = format(d, "yyyy-MM");
    const base = 18000 + idx * 150;
    const faturadoMes = Math.max(0, Math.round(base + (rng() - 0.5) * 8000));
    const recebidoMes = Math.max(0, Math.round(faturadoMes * (0.78 + rng() * 0.25)));
    faturado.push({ t: label, v: faturadoMes });
    recebido.push({ t: label, v: recebidoMes });
  });

  return {
    from: format(monthsRange[0], "yyyy-MM"),
    to: format(monthsRange[monthsRange.length - 1], "yyyy-MM"),
    group: "month",
    series: [
      { label: "Faturado", points: faturado },
      { label: "Recebido", points: recebido },
    ],
  };
}

export function mockProcessStatus(from: string, to: string, tenantId: number): StatusCount[] {
  const rng = createRng(23 + tenantId);
  const base: Record<string, number> = {
    "Em andamento (escritorio)": 24,
    "Aguardando cliente": 8,
    "Aguardando terceiro": 6,
    "Concluido": 18,
  };
  const periodFactor = Math.min(1.4, Math.max(0.7, daysInRange(from, to) / 30));

  return Object.keys(base).map((status) => {
    const noise = Math.round((rng() - 0.5) * 6);
    return { status, quantidade: Math.max(0, Math.round((base[status] + noise) * periodFactor)) };
  });
}

export function mockTasksStatus(from: string, to: string, tenantId: number): TasksStatusResponse {
  const rng = createRng(71 + tenantId);
  const today = startOfDay(new Date(to));
  const statuses = ["A fazer", "Em andamento", "Bloqueada", "Concluida"] as const;
  const rangeFactor = Math.min(1.5, Math.max(0.75, daysInRange(from, to) / 30));

  const counters: Record<(typeof statuses)[number], { total: number; overdue: number }> = {
    "A fazer": { total: 0, overdue: 0 },
    "Em andamento": { total: 0, overdue: 0 },
    "Bloqueada": { total: 0, overdue: 0 },
    "Concluida": { total: 0, overdue: 0 },
  };

  const tasksCount = Math.max(12, Math.round((68 + Math.floor(rng() * 16)) * rangeFactor));
  for (let i = 0; i < tasksCount; i++) {
    const status = statuses[Math.floor(rng() * statuses.length)];
    const offset = Math.floor(rng() * 20) - 10; // -10 to +10 days from today
    const dueDate = addDays(today, offset);
    const isOverdue = status !== "Concluida" && differenceInCalendarDays(today, dueDate) > 0;
    counters[status].total += 1;
    counters[status].overdue += isOverdue ? 1 : 0;
  }

  const items = statuses.map((status) => ({
    status,
    no_prazo: counters[status].total - counters[status].overdue,
    vencidas: counters[status].overdue,
  }));

  const totalVencidas = items.reduce((sum, item) => sum + item.vencidas, 0);

  return { items, totalVencidas };
}

export function mockPendingClients(from: string, to: string, tenantId: number, idleDays = 14): PendingClient[] {
  const rng = createRng(101 + tenantId);
  const periodFactor = Math.min(1.6, Math.max(0.75, daysInRange(from, to) / 30));
  const names = [
    "Almeida & Costa",
    "Rodrigues Associados",
    "Santos e Filhos",
    "Pereira Partners",
    "Silva Legal",
    "Vieira & Lopes",
    "Mendes Solutions",
    "Ferreira Group",
    "Carvalho Consultoria",
    "Barros Sociedade",
    "Figueiredo Advogados",
    "Martins & Sousa",
    "Ribeiro Legal",
    "Correia Law",
  ];

  const items: PendingClient[] = names.map((cliente) => {
    const processos = Math.max(0, Math.round((rng() - 0.2) * 6 * periodFactor));
    const dias_sem_movimentacao = idleDays + Math.round(rng() * 18);
    return { cliente, processos, dias_sem_movimentacao };
  });

  return items
    .filter((item) => item.processos > 0)
    .sort((a, b) => b.processos - a.processos || b.dias_sem_movimentacao - a.dias_sem_movimentacao)
    .slice(0, 10);
}
