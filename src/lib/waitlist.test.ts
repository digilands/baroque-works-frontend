import { describe, it, expect } from "vitest";
import {
  buildWaitlistPayload,
  countWaitlistServices,
  customServiceCopy,
  hasWaitlistErrors,
  mapServerErrors,
  validateWaitlist,
  type WaitlistFormValues,
} from "@/lib/waitlist";

function makeValues(overrides: Partial<WaitlistFormValues> = {}): WaitlistFormValues {
  return {
    name: "Ada Obi",
    email: "ada@example.com",
    intent: "need",
    city: "Lagos",
    services: ["plumbing"],
    otherChecked: false,
    otherService: "",
    ...overrides,
  };
}

describe("buildWaitlistPayload", () => {
  it("trims name/email/city and lowercases the email", () => {
    const payload = buildWaitlistPayload(
      makeValues({
        name: "  Ada Obi  ",
        email: "  Ada@Example.COM ",
        city: " Lagos ",
      }),
    );
    expect(payload).toEqual({
      name: "Ada Obi",
      email: "ada@example.com",
      city: " Lagos ",
      intent: "need",
      services: ["plumbing"],
    });
  });

  it("maps Handyman to intent offer", () => {
    expect(buildWaitlistPayload(makeValues({ intent: "offer" })).intent).toBe("offer");
  });

  it("appends the trimmed custom service when Other is checked", () => {
    const payload = buildWaitlistPayload(
      makeValues({
        services: ["plumbing"],
        otherChecked: true,
        otherService: "  solar panel installation  ",
      }),
    );
    expect(payload.services).toEqual(["plumbing", "solar panel installation"]);
  });

  it("drops the custom service when Other is unchecked", () => {
    const payload = buildWaitlistPayload(
      makeValues({
        services: ["plumbing"],
        otherChecked: false,
        otherService: "solar panel installation",
      }),
    );
    expect(payload.services).toEqual(["plumbing"]);
  });

  it("does not add a blank custom service even when Other is checked", () => {
    const payload = buildWaitlistPayload(
      makeValues({ otherChecked: true, otherService: "   " }),
    );
    expect(payload.services).toEqual(["plumbing"]);
  });

  it("never sends a role field", () => {
    expect(buildWaitlistPayload(makeValues())).not.toHaveProperty("role");
  });
});

describe("countWaitlistServices", () => {
  it("counts listed plus a usable custom service", () => {
    expect(
      countWaitlistServices(
        makeValues({
          services: ["plumbing", "carpentry"],
          otherChecked: true,
          otherService: "solar",
        }),
      ),
    ).toBe(3);
  });

  it("ignores a blank custom service", () => {
    expect(
      countWaitlistServices(makeValues({ services: ["plumbing"], otherChecked: true, otherService: "  " })),
    ).toBe(1);
  });
});

describe("validateWaitlist", () => {
  it("passes a fully valid form", () => {
    expect(hasWaitlistErrors(validateWaitlist(makeValues()))).toBe(false);
  });

  it("requires name, email, intent, city and at least one service", () => {
    const errors = validateWaitlist({
      name: "",
      email: "",
      intent: "",
      city: "",
      services: [],
      otherChecked: false,
      otherService: "",
    });
    expect(errors.name).toBe("Name is required");
    expect(errors.email).toBe("Email is required");
    expect(errors.intent).toBeTruthy();
    expect(errors.city).toBeTruthy();
    expect(errors.services).toBeTruthy();
  });

  it("enforces the 2–100 character name rule", () => {
    expect(validateWaitlist(makeValues({ name: "A" })).name).toBeTruthy();
    expect(validateWaitlist(makeValues({ name: "A".repeat(101) })).name).toBeTruthy();
  });

  it("rejects malformed emails", () => {
    expect(validateWaitlist(makeValues({ email: "not-an-email" })).email).toBeTruthy();
  });

  it("requires the custom service when Other is checked", () => {
    expect(validateWaitlist(makeValues({ otherChecked: true, otherService: " " })).otherService).toBeTruthy();
    expect(
      validateWaitlist(makeValues({ otherChecked: true, otherService: "x" })).otherService,
    ).toBeTruthy();
  });

  it("accepts a 2–100 character custom service", () => {
    expect(
      validateWaitlist(makeValues({ otherChecked: true, otherService: "solar" })).otherService,
    ).toBeUndefined();
  });

  it("blocks more than the maximum number of services", () => {
    const services = Array.from({ length: 20 }, (_, i) => `service-${i}`);
    const errors = validateWaitlist(
      makeValues({ services, otherChecked: true, otherService: "solar" }),
    );
    expect(errors.services).toBeTruthy();
  });
});

describe("customServiceCopy", () => {
  it("uses role-specific copy", () => {
    expect(customServiceCopy("need").label).toBe("What service do you need?");
    expect(customServiceCopy("offer").label).toBe("What service do you offer?");
    expect(customServiceCopy("").label).toBe("Enter a service");
  });
});

describe("mapServerErrors", () => {
  it("attaches known-field messages and returns the rest", () => {
    const { fieldErrors, generalErrors } = mapServerErrors([
      "email must be a valid email",
      "city is required",
      "something unrelated broke",
    ]);
    expect(fieldErrors.email).toBeTruthy();
    expect(fieldErrors.city).toBeTruthy();
    expect(generalErrors).toEqual(["something unrelated broke"]);
  });

  it("routes custom-service messages to the revealed field only when Other is checked", () => {
    const withOther = mapServerErrors(["custom service is too short"], { otherChecked: true });
    expect(withOther.fieldErrors.otherService).toBeTruthy();

    const withoutOther = mapServerErrors(["custom service is too short"], { otherChecked: false });
    expect(withoutOther.fieldErrors.otherService).toBeUndefined();
  });
});
