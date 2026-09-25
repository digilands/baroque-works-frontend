/** Standardized API error thrown by the BFF client and hooks. */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

interface AxiosLikeError {
  response?: {
    data?: {
      message?: string;
      error?: string;
      errorCode?: string;
      errors?: string[];
    };
    status?: number;
  };
  message?: string;
}

/** Prefer an explicit message, then Zod `errors[]`, then axios/fallback. */
export function pickErrorMessage(
  data:
    | {
        message?: string;
        errors?: string[];
      }
    | undefined,
  fallback: string,
): string {
  if (data?.message && !/^Request failed with status code/i.test(data.message)) {
    return data.message;
  }
  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors.join(" · ");
  }
  return data?.message || fallback;
}

/** Normalize axios / fetch failures into an ApiError. */
export function toApiError(error: unknown, fallbackMessage = "Request failed"): ApiError {
  if (error instanceof ApiError) return error;
  const err = error as AxiosLikeError;
  const status = err.response?.status ?? 0;
  const message = pickErrorMessage(err.response?.data, err.message ?? fallbackMessage);
  const code = err.response?.data?.errorCode ?? err.response?.data?.error ?? "REQUEST_FAILED";
  return new ApiError(status, code, message, err.response?.data);
}
