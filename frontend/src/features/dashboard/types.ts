export type Point = {
  t: string; // ISO date or label
  v: number;
};

export type SeriesResponse = {
  from: string;
  to: string;
  group: string;
  series: Array<{
    label: string;
    points: Point[];
  }>;
};

export type KpisResponse = {
  clientes: {
    ativos: number;
    inativos: number;
    novos_mes: number;
  };
  processos: {
    ativos: number;
    pendentes: number;
    novos_mes: number;
  };
  honorarios: {
    recebido_mes: number;
  };
};
