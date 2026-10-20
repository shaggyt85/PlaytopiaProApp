import { SignInService } from "@/features/auth/services/signInService";
import { SignInResponseSchema } from "@/features/auth/schemas/auth.schema";

import { createFakeHttpClient as fakeHttp } from "../../../helpers/fakeHttpClient";

describe("SignInService", () => {
  it("usa /auth/login/teacher con username y password", async () => {
    const http = fakeHttp({
      access_token: "acceso",
      refresh_token: "refresco",
      id: 42,
      role_id: 4,
      db_id: 7,
    });

    const result = await new SignInService(http).signIn({
      username: "ana@club.com",
      password: "secreta",
    });

    expect(http.post).toHaveBeenCalledWith("/auth/login/teacher", {
      username: "ana@club.com",
      password: "secreta",
    }, SignInResponseSchema);
    expect(result.refresh_token).toBe("refresco");
  });
});
