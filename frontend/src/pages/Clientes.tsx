import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function Clientes() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    full_name: "",
    nif: "",
    phone: "",
    email: "",
  });

  const listQuery = useQuery({
    queryKey: ["clients"],
    queryFn: clientsApi.list,
  });

  const createMutation = useMutation({
    mutationFn: () => clientsApi.create({
      full_name: form.full_name,
      nif: form.nif || null,
      phone: form.phone || null,
      email: form.email || null,
    }),
    onSuccess: () => {
      toast.success("Cliente criado");
      setForm({ full_name: "", nif: "", phone: "", email: "" });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Erro ao criar cliente";
      toast.error(message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim()) {
      toast.error("Nome do cliente e obrigatorio");
      return;
    }
    createMutation.mutate();
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-serif font-bold text-foreground">Clientes</h1>
            <p className="text-muted-foreground mt-2">Cadastro e gestao de clientes</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Novo Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="full_name">Nome completo *</label>
                <Input
                  id="full_name"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="nif">NIF</label>
                <Input
                  id="nif"
                  value={form.nif}
                  onChange={(e) => setForm({ ...form, nif: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="phone">Telefone</label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="email">Email</label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
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
            <CardTitle>Lista de clientes</CardTitle>
          </CardHeader>
          <CardContent>
            {listQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">Carregando...</p>
            ) : listQuery.isError ? (
              <p className="text-sm text-red-500">Erro ao carregar clientes</p>
            ) : listQuery.data && (listQuery.data as any[]).length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum cliente cadastrado.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(listQuery.data as any[] | undefined)?.map((cliente) => (
                    <TableRow key={cliente.id}>
                      <TableCell className="font-medium">{cliente.full_name}</TableCell>
                      <TableCell>{cliente.nif || "-"}</TableCell>
                      <TableCell>{cliente.phone || "-"}</TableCell>
                      <TableCell>{cliente.email || "-"}</TableCell>
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
