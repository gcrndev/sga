import React, { useEffect, useMemo, useState } from "react";
import { format, formatISO, parse, parseISO, startOfMonth } from "date-fns";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { KpiCard } from "./components/KpiCard";
import { TimeSeriesChart } from "./components/TimeSeriesChart";
import { ReceivablesAgingChart } from "./components/ReceivablesAgingChart";
import { ProcessStatusChart } from "./components/ProcessStatusChart";
import { TasksStatusChart } from "./components/TasksStatusChart";
import { PendingClientsChart } from "./components/PendingClientsChart";
import {
  getBillingVsPaymentsSeries,
  getDashboardKpis,
  getPendingClients,
  getProcessStatus,
  getReceivablesAging,
  getTasksStatus,
} from "./api";
import { AgingBar, KpisResponse, PendingClient, SeriesResponse, StatusCount, TasksStatusResponse } from "./types";

function formatCurrency(value: number) {
  return value.toLocaleString("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

function formatNumber(value: number) {
  return value.toLocaleString("pt-PT");
}

function formatDateHuman(value: string) {
  try {
    if (/^\d{4}-\d{2}$/.test(value)) {
      return format(parse(value, "yyyy-MM", new Date()), "MM/yyyy");
    }
    return format(parseISO(value), "dd/MM/yyyy");
  } catch {
    return value;
  }
}

function parseDateInput(value: string) {
  try {
    const parsed = parse(value, "dd/MM/yyyy", new Date());
    if (Number.isNaN(parsed.getTime())) return null;
    return formatISO(parsed, { representation: "date" });
  } catch {
    return null;
  }
}

export function DashboardPage() {
  const { user } = useAuth();
  const tenantId = user?.law_firm_id;
  const { toast } = useToast();

  const today = useMemo(() => new Date(), []);
  const initialFrom = formatISO(startOfMonth(today), { representation: "date" });
  const initialTo = formatISO(today, { representation: "date" });

  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [fromInput, setFromInput] = useState(formatDateHuman(initialFrom));
  const [toInput, setToInput] = useState(formatDateHuman(initialTo));

  const [kpis, setKpis] = useState<KpisResponse | null>(null);
  const [aging, setAging] = useState<AgingBar[]>([]);
  const [billingSeries, setBillingSeries] = useState<SeriesResponse | null>(null);
  const [processStatus, setProcessStatus] = useState<StatusCount[]>([]);
  const [tasksStatus, setTasksStatus] = useState<TasksStatusResponse | null>(null);
  const [pendingClients, setPendingClients] = useState<PendingClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!tenantId) {
      setIsLoading(false);
      return;
    }
    const load = async () => {
      setIsLoading(true);
      try {
        const [kpiData, agingData, billingData, processData, tasksData, pendingData] = await Promise.all([
          getDashboardKpis(from, to, tenantId),
          getReceivablesAging(from, to, tenantId),
          getBillingVsPaymentsSeries(tenantId),
          getProcessStatus(from, to, tenantId),
          getTasksStatus(from, to, tenantId),
          getPendingClients(from, to, tenantId, 14),
        ]);
        setKpis(kpiData);
        setAging(agingData);
        setBillingSeries(billingData);
        setProcessStatus(processData);
        setTasksStatus(tasksData);
        setPendingClients(pendingData);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [from, to, tenantId]);

  const handleDrillDown = (label: string, filter: string) => {
    toast({
      title: "Drill-down",
      description: `Filtro aplicado: ${label} - ${filter}`,
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Visao consolidada do tenant - periodo global aplicado em todos os blocos
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Periodo: {formatDateHuman(from)} a {formatDateHuman(to)}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-xs text-muted-foreground">De</label>
            <Input
              type="text"
              inputMode="numeric"
              placeholder="dd/mm/aaaa"
              value={fromInput}
              onChange={(e) => {
                const raw = e.target.value;
                setFromInput(raw);
                const iso = parseDateInput(raw);
                if (iso) setFrom(iso);
              }}
              className="w-36"
            />
            <label className="text-xs text-muted-foreground">Ate</label>
            <Input
              type="text"
              inputMode="numeric"
              placeholder="dd/mm/aaaa"
              value={toInput}
              onChange={(e) => {
                const raw = e.target.value;
                setToInput(raw);
                const iso = parseDateInput(raw);
                if (iso) setTo(iso);
              }}
              className="w-36"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const todayDate = new Date();
                const newFrom = formatISO(startOfMonth(todayDate), { representation: "date" });
                const newTo = formatISO(todayDate, { representation: "date" });
                setFrom(newFrom);
                setTo(newTo);
                setFromInput(formatDateHuman(newFrom));
                setToInput(formatDateHuman(newTo));
              }}
            >
              Mes atual
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <KpiCard
            title="Total a receber"
            value={kpis ? formatCurrency(kpis.financeiro.total_a_receber) : isLoading ? "..." : formatCurrency(0)}
            subtitle="Faturas em aberto (aging)"
          />
          <KpiCard
            title="Total recebido (periodo)"
            value={kpis ? formatCurrency(kpis.financeiro.total_recebido_periodo) : isLoading ? "..." : formatCurrency(0)}
            subtitle="Pagamentos efetivados no periodo"
          />
          <KpiCard
            title="Clientes ativos"
            value={kpis ? formatNumber(kpis.clientes.ativos) : isLoading ? "..." : 0}
            subtitle="Clientes com pelo menos um processo ativo"
          />
          <KpiCard
            title="Clientes inativos"
            value={kpis ? formatNumber(kpis.clientes.inativos) : isLoading ? "..." : 0}
            subtitle="Sem processos ativos ou todos concluidos"
          />
          <KpiCard
            title="Tarefas vencidas"
            value={kpis ? formatNumber(kpis.tarefas.vencidas) : isLoading ? "..." : 0}
            subtitle="Alta prioridade operacional"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          <div className="xl:col-span-6">
            <ReceivablesAgingChart
              data={aging}
              formatValue={(v) => formatCurrency(v)}
              onSelectBucket={(bucket) => handleDrillDown("Contas a receber", bucket)}
            />
          </div>

          <div className="xl:col-span-6">
            {billingSeries && (
              <TimeSeriesChart
                title="Faturado vs Recebido (12 meses)"
                series={billingSeries}
                valueFormatter={(v) => formatCurrency(v)}
                onPointClick={(payload) => {
                  const faturado = payload?.Faturado;
                  const recebido = payload?.Recebido;
                  handleDrillDown(
                    "Faturado vs Recebido",
                    `${formatDateHuman(payload?.t)} - Faturado ${formatCurrency(faturado ?? 0)} - Recebido ${formatCurrency(recebido ?? 0)}`,
                  );
                }}
              />
            )}
          </div>

          <div className="xl:col-span-5">
            <ProcessStatusChart
              data={processStatus}
              onSelectStatus={(status) => handleDrillDown("Processos", status)}
            />
          </div>

          <div className="xl:col-span-7">
            {tasksStatus && (
              <TasksStatusChart
                data={tasksStatus}
                onSelectStatus={(status) => handleDrillDown("Tarefas", status)}
              />
            )}
          </div>

          <div className="xl:col-span-12">
            <PendingClientsChart
              data={pendingClients}
              onSelectClient={(client) =>
                handleDrillDown("Pendencias de escritorio", `${client.cliente} - ${client.processos} processos`)
              }
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default DashboardPage;
