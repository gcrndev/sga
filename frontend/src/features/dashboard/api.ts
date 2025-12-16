import { KpisResponse, SeriesResponse } from "./types";
import {
  mockCasesSeries,
  mockClientsSeries,
  mockDashboardKpis,
  mockFeesSeries,
} from "./mocks";

const USE_MOCKS = true;

function resolveMock<T>(fn: () => T): Promise<T> {
  return Promise.resolve(fn());
}

export async function getDashboardKpis(from: string, to: string): Promise<KpisResponse> {
  if (USE_MOCKS) {
    return resolveMock(() => mockDashboardKpis(from, to));
  }
  // TODO: substituir por chamada real
  throw new Error("API real nao implementada");
}

export async function getClientsSeries(from: string, to: string): Promise<SeriesResponse> {
  if (USE_MOCKS) {
    return resolveMock(() => mockClientsSeries(from, to));
  }
  throw new Error("API real nao implementada");
}

export async function getCasesSeries(from: string, to: string): Promise<SeriesResponse> {
  if (USE_MOCKS) {
    return resolveMock(() => mockCasesSeries(from, to));
  }
  throw new Error("API real nao implementada");
}

export async function getFeesSeries(from: string, to: string): Promise<SeriesResponse> {
  if (USE_MOCKS) {
    return resolveMock(() => mockFeesSeries(from, to));
  }
  throw new Error("API real nao implementada");
}
