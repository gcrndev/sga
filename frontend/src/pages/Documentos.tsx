import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileText, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Documentos() {
  const templates = [
    { nome: "Petição Inicial", categoria: "Cível" },
    { nome: "Contestação", categoria: "Cível" },
    { nome: "Recurso de Apelação", categoria: "Recursos" },
    { nome: "Defesa Prévia", categoria: "Criminal" },
  ];

  const documentos = [
    { nome: "Contrato_Cliente_001.pdf", processo: "0001234-56.2024", data: "20/11/2024" },
    { nome: "Procuração_Ana_Rodrigues.pdf", processo: "-", data: "19/11/2024" },
    { nome: "Petição_Inicial_Civil.pdf", processo: "0002345-67.2024", data: "18/11/2024" },
  ];

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-4xl font-serif font-bold text-foreground">Documentos</h1>
          <p className="text-muted-foreground mt-2">Templates e arquivos</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-serif">Modelos de Documentos</CardTitle>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Novo
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {templates.map((template, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{template.nome}</p>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {template.categoria}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Usar</Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-serif">Documentos Recentes</CardTitle>
              <Button size="sm" variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Upload
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {documentos.map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-accent" />
                    <div>
                      <p className="font-medium text-sm">{doc.nome}</p>
                      <p className="text-xs text-muted-foreground">{doc.processo} • {doc.data}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
