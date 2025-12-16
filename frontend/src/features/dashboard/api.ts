import {
  AgingBar,
  KpisResponse,
  PendingClient,
  SeriesResponse,
  StatusCount,
  TasksStatusResponse,
} from "./types";
import {
  mockBillingVsPaymentsSeries,
  mockCasesSeries,
  mockClientsSeries,
  mockDashboardKpis,
  mockFeesSeries,
  mockPendingClients,
  mockProcessStatus,
  mockReceivablesAging,
  mockTasksStatus,
} from "./mocks";

const USE_MOCKS = true;

function resolveMock<T>(fn: () => T): Promise<T> {
  return Promise.resolve(fn());
}

export async function getDashboardKpis(from: string, to: string, tenantId: number): Promise<KpisResponse> {
  if (USE_MOCKS) {
    return resolveMock(() => mockDashboardKpis(from, to, tenantId));
  }
  // TODO: substituir por chamada real
  throw new Error("API real nao implementada");
}

export async function getClientsSeries(from: string, to: string, tenantId: number): Promise<SeriesResponse> {
  if (USE_MOCKS) {
    return resolveMock(() => mockClientsSeries(from, to, tenantId));
  }
  throw new Error("API real nao implementada");
}

export async function getCasesSeries(from: string, to: string, tenantId: number): Promise<SeriesResponse> {
  if (USE_MOCKS) {
    return resolveMock(() => mockCasesSeries(from, to, tenantId));
  }
  throw new Error("API real nao implementada");
}

export async function getFeesSeries(from: string, to: string, tenantId: number): Promise<SeriesResponse> {
  if (USE_MOCKS) {
    return resolveMock(() => mockFeesSeries(from, to, tenantId));
  }
  throw new Error("API real nao implementada");
}

export async function getReceivablesAging(from: string, to: string, tenantId: number): Promise<AgingBar[]> {
  if (USE_MOCKS) {
    return resolveMock(() => mockReceivablesAging(from, to, tenantId));
  }
  throw new Error("API real nao implementada");
}

export async function getBillingVsPaymentsSeries(tenantId: number): Promise<SeriesResponse> {
  if (USE_MOCKS) {
    return resolveMock(() => mockBillingVsPaymentsSeries(tenantId));
  }
  throw new Error("API real nao implementada");
}

export async function getProcessStatus(from: string, to: string, tenantId: number): Promise<StatusCount[]> {
  if (USE_MOCKS) {
    return resolveMock(() => mockProcessStatus(from, to, tenantId));
  }
  throw new Error("API real nao implementada");
}

export async function getTasksStatus(from: string, to: string, tenantId: number): Promise<TasksStatusResponse> {
  if (USE_MOCKS) {
    return resolveMock(() => mockTasksStatus(from, to, tenantId));
  }
  throw new Error("API real nao implementada");
}

export async function getPendingClients(
  from: string,
  to: string,
  tenantId: number,
  idleDays?: number,
): Promise<PendingClient[]> {
  if (USE_MOCKS) {
    return resolveMock(() => mockPendingClients(from, to, tenantId, idleDays ?? 14));
  }
  throw new Error("API real nao implementada");
}
