import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { clientsApi } from "@/lib/api";
import { Scale, Users, Calendar, DollarSign, FileText, AlertCircle } from "lucide-react";

export default function Dashboard() {
  const clientsQuery = useQuery({ queryKey: ["clients"], queryFn: clientsApi.list });

  const clientCount = Array.isArray(clientsQuery.data) ? clientsQuery.data.length : 0;

  const stats = [
    { title: "Clientes", value: clientsQuery.isLoading ? "..." : String(clientCount), icon: Users, color: "text-accent" },
    { title: "Processos ativos", value: "-", icon: Scale, color: "text-primary" },
    { title: "Prazos esta semana", value: "-", icon: AlertCircle, color: "text-warning" },
    { title: "Audiencias proximas", value: "-", icon: Calendar, color: "text-info" },
    { title: "Honorarios (mes)", value: "-", icon: DollarSign, color: "text-success" },
    { title: "Leads em aberto", value: "-", icon: FileText, color: "text-muted-foreground" },
  ];

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-4xl font-serif font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Visao geral do escritorio</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-serif">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Prazos urgentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Sem dados ainda.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Proximas audiencias</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Sem dados ainda.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
