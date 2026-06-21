// @vitest-environment node

import { describe, test, expect, vi, beforeEach } from "vitest";
import { jwtVerify } from "jose";

vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({ cookies: vi.fn() }));

import { cookies } from "next/headers";
import { createSession } from "@/lib/auth";

const DEV_SECRET = new TextEncoder().encode("development-secret-key");

const mockSet = vi.fn();
const mockDelete = vi.fn();

function mockCookies() {
  (cookies as ReturnType<typeof vi.fn>).mockResolvedValue({
    get: vi.fn(),
    set: mockSet,
    delete: mockDelete,
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  mockCookies();
});

describe("createSession", () => {
  test("sets auth-token cookie with correct name and options", async () => {
    await createSession("user-1", "test@example.com");

    expect(mockSet).toHaveBeenCalledOnce();
    const [name, , options] = mockSet.mock.calls[0];
    expect(name).toBe("auth-token");
    expect(options).toMatchObject({
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });
  });

  test("cookie value is a valid JWT containing userId and email", async () => {
    await createSession("user-1", "test@example.com");

    const token: string = mockSet.mock.calls[0][1];
    const { payload } = await jwtVerify(token, DEV_SECRET);
    expect(payload.userId).toBe("user-1");
    expect(payload.email).toBe("test@example.com");
  });
});
