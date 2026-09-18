import { NextResponse, type NextRequest } from "next/server";
import { backendGet } from "@/lib/server/backend";

// Backend-driven snapshot stream. Always dynamic — never static.
export const dynamic = "force-dynamic";

/**
 * GET /api/sse?channel=bookings|jobs — Server-Sent Events endpoint.
 *
 * Vercel serverless functions cannot hold connections open indefinitely,
 * so each stream sends one data snapshot plus heartbeats, then closes
 * after ~20s. EventSource reconnects automatically, which gives the
 * dashboard near-live updates without long-lived functions.
 */
export async function GET(request: NextRequest) {
  const channel = new URL(request.url).searchParams.get("channel") ?? "bookings";
  if (channel !== "bookings" && channel !== "jobs") {
    return NextResponse.json(
      { success: false, message: "Unknown channel" },
      { status: 400 },
    );
  }

  const encoder = new TextEncoder();
  let closed = false;

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        if (closed) return;
        try {
          controller.enqueue(
            encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`),
          );
        } catch {
          closed = true;
        }
      };

      try {
        const snapshot =
          channel === "bookings"
            ? await backendGet("/bookings?limit=10").catch(() => ({ bookings: [] }))
            : await backendGet("/jobs?limit=20").catch(() => ({ jobs: [] }));
        send(channel, snapshot);

        for (let i = 0; i < 4 && !closed; i++) {
          await new Promise((resolve) => setTimeout(resolve, 5000));
          send("ping", { t: Date.now() });
        }
      } finally {
        closed = true;
        try {
          controller.close();
        } catch {
          // already closed
        }
      }
    },
    cancel() {
      closed = true;
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
