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
    data?: { message?: string; error?: string; errorCode?: string };
    status?: number;
  };
  message?: string;
}

/** Normalize axios / fetch failures into an ApiError. */
export function toApiError(error: unknown, fallbackMessage = "Request failed"): ApiError {
  if (error instanceof ApiError) return error;
  const err = error as AxiosLikeError;
  const status = err.response?.status ?? 0;
  const message = err.response?.data?.message ?? err.message ?? fallbackMessage;
  const code = err.response?.data?.errorCode ?? err.response?.data?.error ?? "REQUEST_FAILED";
  return new ApiError(status, code, message, err.response?.data);
}
