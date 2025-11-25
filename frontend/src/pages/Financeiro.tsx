import { MainLayout } from "@/components/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, TrendingDown, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Financeiro() {
  const honorarios = [
    { cliente: "Ana Rodrigues", processo: "0001234-56.2024", valor: "€ 5.000", status: "pago", data: "15/11/2024" },
    { cliente: "Carlos Mendes", processo: "0002345-67.2024", valor: "€ 8.500", status: "pendente", data: "20/11/2024" },
    { cliente: "Empresa XYZ Lda", processo: "0003456-78.2024", valor: "€ 12.000", status: "pago", data: "10/11/2024" },
  ];

  const getStatusColor = (status: string) => {
    return status === "pago" ? "bg-success/10 text-success" : "bg-warning/10 text-warning";
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-serif font-bold text-foreground">Financeiro</h1>
            <p className="text-muted-foreground mt-2">Honorários e despesas</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Lançamento
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Recebido (Mês)
              </CardTitle>
              <DollarSign className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-serif text-success">€ 45.500</div>
              <div className="flex items-center gap-1 text-xs text-success mt-2">
                <TrendingUp className="h-3 w-3" />
                +12% vs mês anterior
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                A Receber
              </CardTitle>
              <DollarSign className="h-5 w-5 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-serif text-warning">€ 18.500</div>
              <p className="text-xs text-muted-foreground mt-2">12 faturas pendentes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Despesas (Mês)
              </CardTitle>
              <DollarSign className="h-5 w-5 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-serif text-destructive">€ 8.200</div>
              <div className="flex items-center gap-1 text-xs text-destructive mt-2">
                <TrendingDown className="h-3 w-3" />
                -5% vs mês anterior
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Honorários Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Processo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {honorarios.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{item.cliente}</TableCell>
                    <TableCell className="font-mono text-sm">{item.processo}</TableCell>
                    <TableCell className="font-semibold">{item.valor}</TableCell>
                    <TableCell>{item.data}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Ver</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
