import React, { useEffect, useState } from "react";
import { formatISO, startOfMonth } from "date-fns";
import { MainLayout } from "@/components/layouts/MainLayout";
import { KpiCard } from "./components/KpiCard";
import { TimeSeriesChart } from "./components/TimeSeriesChart";
import { getCasesSeries, getClientsSeries, getDashboardKpis, getFeesSeries } from "./api";
import { KpisResponse, SeriesResponse } from "./types";

function formatCurrency(value: number) {
  return value.toLocaleString("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

export function DashboardPage() {
  const today = new Date();
  const from = startOfMonth(today);
  const fromStr = formatISO(from, { representation: "date" });
  const toStr = formatISO(today, { representation: "date" });

  const [kpis, setKpis] = useState<KpisResponse | null>(null);
  const [clientsSeries, setClientsSeries] = useState<SeriesResponse | null>(null);
  const [casesSeries, setCasesSeries] = useState<SeriesResponse | null>(null);
  const [feesSeries, setFeesSeries] = useState<SeriesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [kpiData, clients, cases, fees] = await Promise.all([
          getDashboardKpis(fromStr, toStr),
          getClientsSeries(fromStr, toStr),
          getCasesSeries(fromStr, toStr),
          getFeesSeries(fromStr, toStr),
        ]);
        setKpis(kpiData);
        setClientsSeries(clients);
        setCasesSeries(cases);
        setFeesSeries(fees);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [fromStr, toStr]);

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Periodo: {fromStr} a {toStr}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KpiCard
            title="Clientes"
            value={kpis ? kpis.clientes.ativos : isLoading ? "..." : 0}
            subtitle={
              kpis
                ? `Novos no mes: ${kpis.clientes.novos_mes} • Inativos: ${kpis.clientes.inativos}`
                : "Carregando..."
            }
          />
          <KpiCard
            title="Processos"
            value={kpis ? kpis.processos.ativos : isLoading ? "..." : 0}
            subtitle={
              kpis
                ? `Novos: ${kpis.processos.novos_mes} • Pendentes: ${kpis.processos.pendentes}`
                : "Carregando..."
            }
          />
          <KpiCard
            title="Honorarios"
            value={kpis ? formatCurrency(kpis.honorarios.recebido_mes) : isLoading ? "..." : formatCurrency(0)}
            subtitle={kpis ? "Recebido no mes" : "Carregando..."}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {clientsSeries && (
            <TimeSeriesChart
              title="Clientes (novos vs ativos)"
              series={clientsSeries}
            />
          )}
          {casesSeries && (
            <TimeSeriesChart
              title="Processos (novos, pendentes, ativos)"
              series={casesSeries}
            />
          )}
        </div>

        <div className="grid grid-cols-1">
          {feesSeries && (
            <TimeSeriesChart
              title="Honorarios recebidos por dia"
              series={feesSeries}
              valueFormatter={(v) => formatCurrency(v)}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default DashboardPage;
