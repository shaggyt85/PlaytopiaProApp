import { VersionCheckService } from "@/features/app-update/services/versionCheckService";

import { createFakeHttpClient as fakeHttp } from "../../../helpers/fakeHttpClient";

const response = {
  current: "1.0.0",
  latest: "1.1.0",
  minimum: "1.0.0",
  update_type: "soft",
  release_notes: null,
  store_url: { ios: "https://apps.apple.com/pro", android: null },
};

describe("VersionCheckService", () => {
  it("pregunta por la app de profesores, con su tienda y su versión", async () => {
    const http = fakeHttp(response);

    const result = await new VersionCheckService(http).check("ios", "1.0.0");

    expect(http.get).toHaveBeenCalledWith("/App/version-check", {
      params: { platform: "ios", current_version: "1.0.0", app: "teacher" },
    });
    expect(result).toEqual({ update_type: "soft", store_url: response.store_url });
  });

  it("un aviso que no es de los tres no cumple el contrato", async () => {
    await expect(
      new VersionCheckService(fakeHttp({ ...response, update_type: "later" })).check("ios", "1.0.0"),
    ).rejects.toThrow();
  });
});
