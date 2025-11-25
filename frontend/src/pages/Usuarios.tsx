import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Shield } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { usersApi } from "@/lib/api";

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Admin",
  ADVOGADO: "Advogado",
  ADMINISTRATIVO: "Administrativo",
  FINANCEIRO: "Financeiro",
  PARCEIRO: "Parceiro",
};

export default function Usuarios() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", role: "ADVOGADO" });

  const listQuery = useQuery({ queryKey: ["staff"], queryFn: usersApi.listStaff });

  const createMutation = useMutation({
    mutationFn: () =>
      usersApi.createStaff({
        name: form.nome,
        email: form.email,
        role: form.role,
      }),
    onSuccess: () => {
      toast.success("Convite enviado");
      setForm({ nome: "", email: "", role: "ADVOGADO" });
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Erro ao convidar usuario";
      toast.error(message);
    },
  });

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim() || !form.email.trim()) {
      toast.error("Nome e email sao obrigatorios");
      return;
    }
    createMutation.mutate();
  };

  const getPerfilColor = (role: string) => {
    const colors: Record<string, string> = {
      ADMIN: "bg-primary/10 text-primary",
      ADVOGADO: "bg-accent/10 text-accent",
      ADMINISTRATIVO: "bg-info/10 text-info",
      FINANCEIRO: "bg-warning/10 text-warning",
      PARCEIRO: "bg-muted",
    };
    return colors[role] || "bg-muted";
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-serif font-bold text-foreground">Usuarios</h1>
            <p className="text-muted-foreground mt-2">Gestao de usuarios e permissoes</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Convidar usuario
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Convidar usuario</DialogTitle>
              </DialogHeader>
              <form className="space-y-4" onSubmit={handleInvite}>
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Papel</Label>
                  <select
                    id="role"
                    className="border rounded px-3 py-2 text-sm w-full bg-background"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  >
                    {Object.keys(ROLE_LABELS).map((role) => (
                      <option key={role} value={role}>
                        {ROLE_LABELS[role]}
                      </option>
                    ))}
                  </select>
                </div>
                <DialogFooter>
                  <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Enviando..." : "Enviar convite"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="font-serif">Usuarios do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              {listQuery.isLoading ? (
                <p className="text-sm text-muted-foreground">Carregando...</p>
              ) : listQuery.isError ? (
                <p className="text-sm text-red-500">Erro ao carregar usuarios</p>
              ) : Array.isArray(listQuery.data) && listQuery.data.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum usuario cadastrado.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Perfil</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(listQuery.data as any[] | undefined)?.map((usuario) => (
                      <TableRow key={usuario.id}>
                        <TableCell className="font-medium">{usuario.name}</TableCell>
                        <TableCell>{usuario.email}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={getPerfilColor(usuario.role)}>
                            {ROLE_LABELS[usuario.role] || usuario.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch checked={usuario.is_active} disabled />
                            <span className="text-xs text-muted-foreground">
                              {usuario.is_active ? "Ativo" : "Inativo"}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-lg">Perfis de Acesso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.keys(ROLE_LABELS).map((perfil) => (
                <div
                  key={perfil}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium capitalize">{ROLE_LABELS[perfil]}</p>
                    <p className="text-xs text-muted-foreground">
                      {perfil === "ADMIN" ? "Acesso total" : "Acesso limitado"}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
