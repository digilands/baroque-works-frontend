import { NextResponse, type NextRequest } from "next/server";
import { ApiError } from "@/lib/api-errors";
import {
  backendDelete,
  backendGet,
  backendMultipartPost,
  backendPatch,
  backendPost,
  backendPut,
} from "@/lib/server/backend";

/**
 * Thin BFF wrappers over the shared server backend client
 * (`src/lib/server/backend.ts`). Route handlers convert results
 * to JSON responses; RSCs use the backend client directly.
 */

function toResponse<T>(data: T) {
  return NextResponse.json(data);
}

function toErrorResponse(error: unknown, fallbackMessage: string) {
  if (error instanceof ApiError) {
    console.error(fallbackMessage, error.details ?? error.message);
    const details = error.details as { errors?: string[] } | undefined;
    return NextResponse.json(
      {
        success: false,
        message: error.message,
        ...(Array.isArray(details?.errors) && details.errors.length > 0
          ? { errors: details.errors }
          : {}),
      },
      { status: error.status || 500 },
    );
  }
  console.error(fallbackMessage, error);
  return NextResponse.json(
    { success: false, message: fallbackMessage },
    { status: 500 },
  );
}

function withQuery(backendPath: string, request: NextRequest): string {
  const query = new URL(request.url).searchParams.toString();
  return query ? `${backendPath}?${query}` : backendPath;
}

/** Proxy a GET request to the backend, forwarding query params and auth. */
export async function proxyGet(request: NextRequest, backendPath: string) {
  try {
    return toResponse(await backendGet(withQuery(backendPath, request)));
  } catch (error) {
    return toErrorResponse(error, "Request failed");
  }
}

/** Proxy a POST request to the backend with a JSON body and auth. */
export async function proxyPost(request: NextRequest, backendPath: string) {
  try {
    const body = await request.json();
    return toResponse(await backendPost(withQuery(backendPath, request), body));
  } catch (error) {
    return toErrorResponse(error, "Request failed");
  }
}

/** Proxy a PATCH request to the backend with a JSON body and auth. */
export async function proxyPatch(request: NextRequest, backendPath: string) {
  try {
    const body = await request.json();
    return toResponse(await backendPatch(withQuery(backendPath, request), body));
  } catch (error) {
    return toErrorResponse(error, "Request failed");
  }
}

/** Proxy a DELETE request to the backend, forwarding an optional JSON body. */
export async function proxyDelete(request: NextRequest, backendPath: string) {
  try {
    const body = await request.json().catch(() => undefined);
    return toResponse(await backendDelete(withQuery(backendPath, request), body));
  } catch (error) {
    return toErrorResponse(error, "Request failed");
  }
}

/** Proxy a PUT request to the backend with a JSON body and auth. */
export async function proxyPut(request: NextRequest, backendPath: string) {
  try {
    const body = await request.json();
    return toResponse(await backendPut(withQuery(backendPath, request), body));
  } catch (error) {
    return toErrorResponse(error, "Request failed");
  }
}

/** Proxy a multipart/form-data request to the backend (file uploads). */
export async function proxyMultipartPost(
  request: NextRequest,
  backendPath: string,
) {
  try {
    const formData = await request.formData();
    return toResponse(
      await backendMultipartPost(withQuery(backendPath, request), formData),
    );
  } catch (error) {
    return toErrorResponse(error, "Upload failed");
  }
}
