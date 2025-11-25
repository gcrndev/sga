import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { clientsApi } from "@/lib/api";

export default function Leads() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ nome: "", telefone: "", email: "" });

  const listQuery = useQuery({ queryKey: ["leads"], queryFn: clientsApi.list });

  const createMutation = useMutation({
    mutationFn: () =>
      clientsApi.create({
        full_name: form.nome,
        phone: form.telefone || null,
        email: form.email || null,
      }),
    onSuccess: () => {
      toast.success("Lead criado");
      setForm({ nome: "", telefone: "", email: "" });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Erro ao criar lead";
      toast.error(message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim()) {
      toast.error("Nome e obrigatorio");
      return;
    }
    createMutation.mutate();
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-serif font-bold text-foreground">Leads</h1>
            <p className="text-muted-foreground mt-2">Gerencie seus potenciais clientes</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Novo lead</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={handleSubmit}>
              <Input
                placeholder="Nome"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                required
              />
              <Input
                placeholder="Telefone"
                value={form.telefone}
                onChange={(e) => setForm({ ...form, telefone: e.target.value })}
              />
              <Input
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <div className="md:col-span-3 flex justify-end">
                <Button type="submit" className="gap-2" disabled={createMutation.isPending}>
                  <Plus className="h-4 w-4" />
                  {createMutation.isPending ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leads</CardTitle>
          </CardHeader>
          <CardContent>
            {listQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">Carregando...</p>
            ) : listQuery.isError ? (
              <p className="text-sm text-red-500">Erro ao carregar leads</p>
            ) : Array.isArray(listQuery.data) && listQuery.data.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum lead cadastrado.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(listQuery.data as any[] | undefined)?.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">{lead.full_name}</TableCell>
                      <TableCell>{lead.phone || "-"}</TableCell>
                      <TableCell>{lead.email || "-"}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-info/10 text-info">
                          novo
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
