import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { publicFormsApi } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Scale } from "lucide-react";

const SERVICE_OPTIONS = [
  { value: "ACAO_JUDICIAL", label: "Ação Judicial" },
  { value: "NACIONALIDADE", label: "Nacionalidade" },
  { value: "VISTO", label: "Visto" },
];

export default function PublicClientForm() {
  const { slug = "" } = useParams<{ slug: string }>();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service_type: SERVICE_OPTIONS[0]?.value || "",
    date_of_birth: "",
    passport_number: "",
    nif: "",
    address: "",
    postal_code: "",
    nationality: "",
  });

  const mutation = useMutation({
    mutationFn: () =>
      publicFormsApi.submitClient(slug, {
        ...form,
      }),
    onSuccess: () => {
      toast.success("Dados enviados. O escritório entrará em contacto.");
      setForm({
        ...form,
        name: "",
        email: "",
        phone: "",
        date_of_birth: "",
        passport_number: "",
        nif: "",
        address: "",
        postal_code: "",
        nationality: "",
      });
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error ? err.message : "Erro ao enviar solicitacao";
      toast.error(message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug) {
      toast.error("Slug do escritorio nao encontrado.");
      return;
    }
    mutation.mutate();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-accent/20 p-4">
      <Card className="w-full max-w-3xl shadow-xl">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
            <Scale className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-serif">
            Formulario do cliente
          </CardTitle>
          <CardDescription className="text-base">
            Envie seus dados para que o escritorio possa avaliar seu pedido.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                placeholder="+351 91234-5678"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="service">Servico desejado *</Label>
                <select
                  id="service"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.service_type}
                  onChange={(e) =>
                    setForm({ ...form, service_type: e.target.value })
                  }
                  required
                >
                  {SERVICE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Data de nascimento</Label>
                <Input
                  id="dob"
                  type="date"
                  value={form.date_of_birth}
                  onChange={(e) =>
                    setForm({ ...form, date_of_birth: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="passport">Passaporte</Label>
                <Input
                  id="passport"
                  value={form.passport_number}
                  onChange={(e) =>
                    setForm({ ...form, passport_number: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nif">NIF (opcional)</Label>
                <Input
                  id="nif"
                  value={form.nif}
                  onChange={(e) => setForm({ ...form, nif: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationality">Nacionalidade *</Label>
                <Input
                  id="nationality"
                  value={form.nationality}
                  onChange={(e) =>
                    setForm({ ...form, nationality: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address">Endereco completo *</Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postal">Codigo postal *</Label>
                <Input
                  id="postal"
                  value={form.postal_code}
                  onChange={(e) =>
                    setForm({ ...form, postal_code: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Enviando..." : "Enviar dados"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-sm text-center text-muted-foreground">
          Seus dados serao enviados ao escritorio selecionado.
        </CardFooter>
      </Card>
    </div>
  );
}
