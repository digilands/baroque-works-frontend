"use client";

import { useEffect, useRef } from "react";

export type SSEChannel = "bookings" | "jobs";

/**
 * Subscribe to a dashboard SSE channel. The server sends one snapshot per
 * connection plus heartbeats, then closes; EventSource reconnects
 * automatically, yielding near-live updates on serverless-friendly
 * short-lived streams.
 */
export function useSSE(channel: SSEChannel, onMessage: (data: unknown) => void) {
  const handlerRef = useRef(onMessage);

  // Sync the latest handler without writing the ref during render.
  useEffect(() => {
    handlerRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (typeof window === "undefined" || !("EventSource" in window)) return;

    let source: EventSource | null = null;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    let disposed = false;

    const listener = (event: Event) => {
      try {
        handlerRef.current(JSON.parse((event as MessageEvent).data));
      } catch {
        // ignore malformed frames
      }
    };

    const connect = () => {
      if (disposed) return;
      source = new EventSource(`/api/sse?channel=${channel}`);
      source.addEventListener(channel, listener);
      // The server closes after ~20s. Browser auto-reconnect can hammer
      // (and briefly re-render) — back off slightly between attempts.
      source.onerror = () => {
        if (disposed || !source) return;
        source.close();
        source = null;
        retryTimer = setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      disposed = true;
      if (retryTimer) clearTimeout(retryTimer);
      if (source) {
        source.removeEventListener(channel, listener);
        source.close();
      }
    };
  }, [channel]);
}
