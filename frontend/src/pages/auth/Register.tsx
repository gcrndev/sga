import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Scale } from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({
    nome: "",
    responsavel: "",
    nif: "",
    telefone: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    pais: "",
    fuso: "",
  });

  const navigate = useNavigate();
  const { registerFirm } = useAuth();

  const mutation = useMutation({
    mutationFn: () =>
      registerFirm({
        firm_name: formData.nome,
        owner_name: formData.responsavel || formData.nome,
        firm_nif: formData.nif,
        firm_phone: formData.telefone,
        firm_email: formData.email,
        owner_email: formData.email,
        owner_password: formData.senha,
      }),
    onSuccess: () => navigate("/dashboard"),
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Erro ao registrar escritorio";
      toast.error(message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.senha !== formData.confirmarSenha) {
      toast.error("As senhas nao coincidem");
      return;
    }
    mutation.mutate();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-accent/20 p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
            <Scale className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-serif">Registrar Escritorio</CardTitle>
          <CardDescription className="text-base">Crie sua conta no SGA</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Dados do escritorio</h3>
              <p className="text-sm text-muted-foreground">
                Use os dados oficiais para vincular clientes e equipe ao CNPJ/NIF correto.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Advocacia *</Label>
                <Input
                  id="nome"
                  placeholder="Escritorio Silva & Associados"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nif">NIF *</Label>
                <Input
                  id="nif"
                  placeholder="123456789"
                  value={formData.nif}
                  onChange={(e) => setFormData({ ...formData, nif: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone *</Label>
                <Input
                  id="telefone"
                  type="tel"
                  placeholder="+351 123 456 789"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contato@escritorio.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Responsavel e acesso</h3>
              <p className="text-sm text-muted-foreground">
                Esse usuario sera o ADMIN inicial com acesso completo.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="responsavel">Nome do responsavel *</Label>
                <Input
                  id="responsavel"
                  placeholder="Nome completo"
                  value={formData.responsavel}
                  onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="senha">Senha *</Label>
                <Input
                  id="senha"
                  type="password"
                  placeholder="********"
                  value={formData.senha}
                  onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                  required
                  minLength={8}
                />
                <p className="text-xs text-muted-foreground">Minimo 8 caracteres.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmar">Confirmar senha *</Label>
                <Input
                  id="confirmar"
                  type="password"
                  placeholder="********"
                  value={formData.confirmarSenha}
                  onChange={(e) => setFormData({ ...formData, confirmarSenha: e.target.value })}
                  required
                  minLength={8}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? "Criando conta..." : "Criar Conta"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-sm text-center text-muted-foreground">
          Ja tem uma conta?
          <Link to="/login" className="text-primary hover:underline font-medium ml-1">
            Fazer login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
