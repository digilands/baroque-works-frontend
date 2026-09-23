import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useGeolocation } from "@/hooks/useGeolocation";

function mockGeolocation(
  impl: typeof navigator.geolocation.getCurrentPosition,
) {
  Object.defineProperty(navigator, "geolocation", {
    value: { getCurrentPosition: impl },
    configurable: true,
  });
}

beforeEach(() => {
  window.localStorage.clear();
  vi.restoreAllMocks();
});

describe("useGeolocation", () => {
  it("starts idle without cached position", () => {
    const { result } = renderHook(() => useGeolocation());
    expect(result.current.position).toBeNull();
    expect(result.current.status).toBe("idle");
  });

  it("grants and caches position on success", () => {
    mockGeolocation((success) =>
      success({
        coords: { latitude: 6.5244, longitude: 3.3792, accuracy: 50 },
      } as GeolocationPosition),
    );
    const { result } = renderHook(() => useGeolocation());
    act(() => result.current.requestLocation());
    expect(result.current.status).toBe("granted");
    expect(result.current.position).toMatchObject({
      latitude: 6.5244,
      longitude: 3.3792,
    });
    expect(window.localStorage.getItem("bw:geo")).toContain("6.5244");
  });

  it("reports denied on permission refusal", () => {
    mockGeolocation((_success, error) =>
      error?.({
        code: 1,
        PERMISSION_DENIED: 1,
      } as GeolocationPositionError),
    );
    const { result } = renderHook(() => useGeolocation());
    act(() => result.current.requestLocation());
    expect(result.current.status).toBe("denied");
    expect(result.current.position).toBeNull();
  });

  it("restores a fresh cached position after mount", async () => {
    window.localStorage.setItem(
      "bw:geo",
      JSON.stringify({
        latitude: 9.0579,
        longitude: 7.4951,
        timestamp: Date.now(),
      }),
    );
    const { result } = renderHook(() => useGeolocation());
    // Cache is loaded on a 0ms timer so SSR and first client paint match.
    await waitFor(() => expect(result.current.status).toBe("granted"));
    expect(result.current.position).toMatchObject({ latitude: 9.0579 });
  });
});
