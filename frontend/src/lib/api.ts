const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

type Options = RequestInit & { skipAuth?: boolean };

let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}

async function request<T>(path: string, options: Options = {}): Promise<T> {
  const token = options.skipAuth ? null : localStorage.getItem("token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const hasBody =
    res.headers.get("content-length") !== "0" &&
    res.status !== 204 &&
    res.status !== 205;

  const data = hasBody ? await res.json().catch(() => null) : null;

  if (res.status === 401 && onUnauthorized) {
    onUnauthorized();
  }

  if (!res.ok) {
    const message = (data as any)?.error || "Erro na requisicao";
    throw new Error(message);
  }

  return data as T;
}

export { request };

export const authApi = {
  login: (body: { email: string; password: string }) =>
    request<{ token: string; user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  registerFirm: (body: {
    firm_name: string;
    firm_email?: string | null;
    firm_nif?: string | null;
    firm_phone?: string | null;
    owner_name: string;
    owner_email: string;
    owner_password: string;
  }) =>
    request<{ token: string; user: any; firm: any }>("/auth/register-firm", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  completeInvite: (body: {
    token: string;
    password: string;
    confirm_password: string;
  }) =>
    request<{ token: string; user: any }>("/auth/complete-invite", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  me: () => request<{ user: any }>("/auth/me"),
};

export const usersApi = {
  createStaff: (body: { name: string; email: string; role: string }) =>
    request("/users/staff", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  listStaff: () => request("/users/staff"),
};

export const clientsApi = {
  list: () => request("/clients"),
  create: (body: {
    full_name: string;
    nif?: string | null;
    phone?: string | null;
    email?: string | null;
    is_minor?: boolean;
    guardian_name?: string | null;
    guardian_contact?: string | null;
    service_type?: string | null;
    date_of_birth?: string | null;
    passport_number?: string | null;
    address?: string | null;
    postal_code?: string | null;
    nationality?: string | null;
  }) =>
    request("/clients", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  updateStatus: (id: number, status: string) =>
    request(`/clients/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};

export const publicFormsApi = {
  submitClient: (
    slug: string,
    body: {
      name: string;
      email: string;
      phone: string;
      service_type: string;
      date_of_birth?: string;
      passport_number?: string;
      nif?: string;
      address: string;
      postal_code: string;
      nationality: string;
    }
  ) =>
    request(`/public/forms/${slug}/clients`, {
      method: "POST",
      body: JSON.stringify(body),
      skipAuth: true,
    }),
};
