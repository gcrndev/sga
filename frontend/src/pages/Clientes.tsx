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
import { useAuth } from "@/context/AuthContext";

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendente",
  active: "Ativo",
  rejected: "Rejeitado",
};

const SERVICE_LABELS: Record<string, string> = {
  ACAO_JUDICIAL: "Acao judicial",
  NACIONALIDADE: "Nacionalidade",
  VISTO: "Visto",
};

export default function Clientes() {
  const { user } = useAuth();
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
    mutationFn: () =>
      clientsApi.create({
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
      const message =
        err instanceof Error ? err.message : "Erro ao criar cliente";
      toast.error(message);
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      clientsApi.updateStatus(id, status),
    onSuccess: () => {
      toast.success("Status atualizado");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error ? err.message : "Erro ao atualizar status";
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

  const publicBase =
    import.meta.env.VITE_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    (typeof window !== "undefined"
      ? window.location.origin
      : "https://sgadvocacias.com") ||
    "https://sgadvocacias.com";
  const publicLink = user?.law_firm_slug
    ? `${publicBase}/firm/${user.law_firm_slug}/novo-cliente`
    : "";

  const handleCopyLink = async () => {
    if (!publicLink) return;
    try {
      await navigator.clipboard.writeText(publicLink);
      toast.success("Link copiado");
    } catch {
      toast.error("Nao foi possivel copiar. Copie manualmente.");
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-serif font-bold text-foreground">
              Clientes
            </h1>
            <p className="text-muted-foreground mt-2">
              Cadastro e gestao de clientes
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Link publico do escritorio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Envie este link para clientes preencherem o formulario publico.
            </p>
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <Input
                value={publicLink}
                readOnly
                placeholder="Slug do escritorio ausente"
              />
              <Button
                type="button"
                onClick={handleCopyLink}
                disabled={!publicLink}
                className="md:w-32"
              >
                Copiar
              </Button>
            </div>
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
              <p className="text-sm text-muted-foreground">
                Nenhum cliente cadastrado.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Servico</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Origem</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(listQuery.data as any[] | undefined)?.map((cliente) => (
                    <TableRow key={cliente.id}>
                      <TableCell className="font-medium">
                        {cliente.full_name}
                      </TableCell>
                      <TableCell>
                        {SERVICE_LABELS[cliente.service_type] ||
                          cliente.service_type ||
                          "-"}
                      </TableCell>
                      <TableCell>
                        <select
                          className="w-28 rounded-md border border-input bg-background px-2 py-1 text-sm"
                          value={cliente.status || "pending"}
                          onChange={(e) =>
                            statusMutation.mutate({
                              id: cliente.id,
                              status: e.target.value,
                            })
                          }
                        >
                          {Object.entries(STATUS_LABELS).map(
                            ([value, label]) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            )
                          )}
                        </select>
                      </TableCell>
                      <TableCell>{cliente.phone || "-"}</TableCell>
                      <TableCell>{cliente.email || "-"}</TableCell>
                      <TableCell className="capitalize">
                        {cliente.sources?.replace("_", " ") || "-"}
                      </TableCell>
                      <TableCell>
                        {cliente.created_at
                          ? new Date(cliente.created_at).toLocaleDateString()
                          : "-"}
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
