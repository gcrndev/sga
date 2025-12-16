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
  financeiro: {
    total_a_receber: number;
    total_recebido_periodo: number;
  };
  clientes: {
    ativos: number;
    inativos: number;
  };
  tarefas: {
    vencidas: number;
  };
};

export type AgingBar = {
  faixa: string;
  honorarios: number;
  despesas: number;
  total: number;
};

export type StatusCount = {
  status: string;
  quantidade: number;
};

export type TasksStatus = {
  status: string;
  no_prazo: number;
  vencidas: number;
};

export type TasksStatusResponse = {
  items: TasksStatus[];
  totalVencidas: number;
};

export type PendingClient = {
  cliente: string;
  processos: number;
  dias_sem_movimentacao: number;
};
