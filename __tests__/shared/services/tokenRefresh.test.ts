import axios from "axios";

import { isRefreshRejected, requestTokenRefresh } from "@/shared/services/tokenRefresh";

jest.mock("axios", () => ({ post: jest.fn() }));

describe("requestTokenRefresh", () => {
  it("pide tokens nuevos a /auth/refresh con el refresh token", async () => {
    jest.mocked(axios.post).mockResolvedValue({ data: { access_token: "a2", refresh_token: "r2" } });

    await expect(requestTokenRefresh("r1")).resolves.toEqual({ access_token: "a2", refresh_token: "r2" });

    expect(axios.post).toHaveBeenCalledWith(
      "https://api.test.local/api/auth/refresh",
      { refresh_token: "r1" },
      expect.objectContaining({ timeout: 15_000 }),
    );
  });

  it("una respuesta sin tokens no cumple el contrato", async () => {
    jest.mocked(axios.post).mockResolvedValue({ data: {} });

    await expect(requestTokenRefresh("r1")).rejects.toThrow();
  });
});

describe("isRefreshRejected", () => {
  it.each([400, 401, 403, 404])("un %s es que Core rechazó el token", (status) => {
    expect(isRefreshRejected({ response: { status } })).toBe(true);
  });

  it.each([
    ["un 500", { response: { status: 500 } }],
    ["un fallo de red", new Error("Network Error")],
    ["nada", undefined],
  ])("%s no dice que la sesión esté muerta", (_case, error) => {
    expect(isRefreshRejected(error)).toBe(false);
  });
});
