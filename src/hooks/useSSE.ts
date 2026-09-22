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
    const source = new EventSource(`/api/sse?channel=${channel}`);
    const listener = (event: Event) => {
      try {
        handlerRef.current(JSON.parse((event as MessageEvent).data));
      } catch {
        // ignore malformed frames
      }
    };
    source.addEventListener(channel, listener);
    // No explicit reconnect needed — EventSource retries on close/error.
    return () => {
      source.removeEventListener(channel, listener);
      source.close();
    };
  }, [channel]);
}
