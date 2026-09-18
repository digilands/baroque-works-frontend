import { cookies } from "next/headers";
import { backendApi } from "@/lib/auth";
import { ApiError } from "@/lib/api-errors";

/**
 * Shared server-side backend client. Used by BFF route handlers AND
 * React Server Components — single code path for backend communication.
 *
 * NOTE: this module must stay importable from route handlers, so it must
 * NOT import `server-only`. The `server-only` guard lives in `queries.ts`,
 * which is RSC-only by design.
 */

const MISSING_ENV_WARNED = "__bw_missing_api_url_warned__";

function baseURL(): string {
  const url =
    backendApi.defaults.baseURL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:3000";
  // Loud fail-fast: without the backend URL every call loopbacks into this
  // server itself (HTML 404s, or infinite self-recursion on RSC pages).
  if (
    !process.env.NEXT_PUBLIC_API_URL &&
    typeof globalThis !== "undefined" &&
    !(globalThis as Record<string, unknown>)[MISSING_ENV_WARNED]
  ) {
    (globalThis as Record<string, unknown>)[MISSING_ENV_WARNED] = true;
    console.warn(
      "[api] NEXT_PUBLIC_API_URL is not set — backend calls will loop back to this server. Set it in .env.local (see .env.example).",
    );
  }
  return url;
}

async function authHeaders(): Promise<Record<string, string>> {
  const store = await cookies();
  const token = store.get("accessToken")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function toBackendError(error: unknown, path: string): ApiError {
  const err = error as {
    response?: {
      status?: number;
      data?: { message?: string; error?: string; errorCode?: string };
    };
    message?: string;
  };
  return new ApiError(
    err.response?.status ?? 0,
    err.response?.data?.errorCode ?? err.response?.data?.error ?? "REQUEST_FAILED",
    err.response?.data?.message ?? err.message ?? `Backend request failed: ${path}`,
    err.response?.data,
  );
}

/** GET the backend. `path` may include a query string. */
export async function backendGet<T>(path: string): Promise<T> {
  try {
    const { data } = await backendApi.get<T>(path, {
      headers: await authHeaders(),
    });
    return data;
  } catch (error) {
    throw toBackendError(error, path);
  }
}

/** POST a JSON body to the backend. */
export async function backendPost<T>(path: string, body: unknown): Promise<T> {
  try {
    const { data } = await backendApi.post<T>(path, body, {
      headers: await authHeaders(),
    });
    return data;
  } catch (error) {
    throw toBackendError(error, path);
  }
}

/** PATCH a JSON body to the backend. */
export async function backendPatch<T>(path: string, body: unknown): Promise<T> {
  try {
    const { data } = await backendApi.patch<T>(path, body, {
      headers: await authHeaders(),
    });
    return data;
  } catch (error) {
    throw toBackendError(error, path);
  }
}

/** PUT a JSON body to the backend (full updates, e.g. services). */
export async function backendPut<T>(path: string, body: unknown): Promise<T> {
  try {
    const { data } = await backendApi.put<T>(path, body, {
      headers: await authHeaders(),
    });
    return data;
  } catch (error) {
    throw toBackendError(error, path);
  }
}

/** DELETE on the backend, with an optional JSON body. */
export async function backendDelete<T>(path: string, body?: unknown): Promise<T> {
  try {
    const { data } = await backendApi.delete<T>(path, {
      headers: await authHeaders(),
      data: body,
    });
    return data;
  } catch (error) {
    throw toBackendError(error, path);
  }
}

/**
 * POST multipart/form-data (file uploads). Uses native fetch so the
 * boundary is set automatically.
 */
export async function backendMultipartPost<T>(
  path: string,
  formData: FormData,
): Promise<T> {
  try {
    const response = await fetch(`${baseURL()}${path}`, {
      method: "POST",
      headers: await authHeaders(),
      body: formData,
    });
    const data = (await response.json().catch(() => ({}))) as T;
    if (!response.ok) {
      const err = data as { message?: string };
      throw new ApiError(
        response.status,
        "REQUEST_FAILED",
        err.message ?? `Upload failed: ${path}`,
        data,
      );
    }
    return data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw toBackendError(error, path);
  }
}
