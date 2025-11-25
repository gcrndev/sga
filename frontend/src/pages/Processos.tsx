import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Processos() {
  const processos = [
    { id: 1, numero: "0001234-56.2024.8.00.0001", tribunal: "1ª Vara Cível", cliente: "Ana Rodrigues", tipo: "Ação de Cobrança", status: "andamento" },
    { id: 2, numero: "0002345-67.2024.8.00.0002", tribunal: "2ª Vara Criminal", cliente: "Carlos Mendes", tipo: "Defesa Criminal", status: "andamento" },
    { id: 3, numero: "0003456-78.2024.8.00.0003", tribunal: "Vara do Trabalho", cliente: "Empresa XYZ Lda", tipo: "Trabalhista", status: "finalizado" },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      "andamento": "bg-info/10 text-info",
      "arquivado": "bg-muted",
      "finalizado": "bg-success/10 text-success",
    };
    return colors[status] || "bg-muted";
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-serif font-bold text-foreground">Processos</h1>
            <p className="text-muted-foreground mt-2">Gestão de processos judiciais</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Processo
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input placeholder="Buscar processos..." className="max-w-sm" />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Tribunal</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processos.map((processo) => (
                  <TableRow key={processo.id}>
                    <TableCell className="font-mono text-sm">{processo.numero}</TableCell>
                    <TableCell>{processo.tribunal}</TableCell>
                    <TableCell className="font-medium">{processo.cliente}</TableCell>
                    <TableCell>{processo.tipo}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getStatusColor(processo.status)}>
                        {processo.status}
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
