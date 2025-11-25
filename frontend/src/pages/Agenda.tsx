import { MainLayout } from "@/components/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Agenda() {
  const eventos = [
    { tipo: "Audiência", processo: "0001234-56.2024", local: "1ª Vara Cível", data: "25/11/2024", hora: "10:00" },
    { tipo: "Prazo", processo: "0002345-67.2024", descricao: "Apresentação de recurso", data: "26/11/2024", hora: "17:00" },
    { tipo: "Audiência", processo: "0003456-78.2024", local: "Vara do Trabalho", data: "27/11/2024", hora: "14:30" },
  ];

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-serif font-bold text-foreground">Agenda</h1>
            <p className="text-muted-foreground mt-2">Prazos e audiências</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Evento
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-serif">Próximos Eventos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {eventos.map((evento, i) => (
                <div key={i} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={evento.tipo === "Audiência" ? "default" : "secondary"}>
                        {evento.tipo}
                      </Badge>
                      <span className="font-mono text-sm text-muted-foreground">{evento.processo}</span>
                    </div>
                    {evento.local && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {evento.local}
                      </div>
                    )}
                    {evento.descricao && (
                      <p className="text-sm text-muted-foreground">{evento.descricao}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <Calendar className="h-4 w-4" />
                      {evento.data}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <Clock className="h-4 w-4" />
                      {evento.hora}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Calendário</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-muted/30 rounded-lg flex items-center justify-center">
                <Calendar className="h-12 w-12 text-muted-foreground" />
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Eventos hoje</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Esta semana</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Este mês</span>
                  <span className="font-medium">45</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
