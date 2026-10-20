import type { SignUpRequest } from "@/features/auth/schemas/signUp.schema";
import { SignUpService } from "@/features/auth/services/signUpService";
import { HttpError } from "@/shared/services/HttpError";
import { SignUpResponseSchema } from "@/features/auth/schemas/signUp.schema";

import { createFakeHttpClient as fakeHttp } from "../../../helpers/fakeHttpClient";

const request: SignUpRequest = {
  name: "Ana",
  last_name: "García",
  email: "ana@club.com",
  password: "Segura1!",
  phone_number: "+34612345678",
  birthday: "1990-05-03T00:00:00",
  gender: 2,
  terms_version: "2026-07-01",
};

describe("SignUpService", () => {
  it("manda el alta a /UserTeacher con el registration_token recién firmado", async () => {
    const http = fakeHttp({ id: 42, email: "ana@club.com", access_token: "a", refresh_token: "r" });
    const signToken = jest.fn(() => "v1.1790000000.firma");

    const result = await new SignUpService(http, signToken).signUp(request);

    expect(http.post).toHaveBeenCalledWith("/UserTeacher", {
      ...request,
      registration_token: "v1.1790000000.firma",
    }, SignUpResponseSchema);
    expect(result).toEqual({ id: 42, email: "ana@club.com" });
  });

  it("firma un token nuevo en cada intento", async () => {
    const http = fakeHttp({ id: 42, email: "ana@club.com" });
    const signToken = jest.fn(() => "v1.1.x");
    const service = new SignUpService(http, signToken);

    await service.signUp(request);
    await service.signUp(request);

    expect(signToken).toHaveBeenCalledTimes(2);
  });

  it("un error de Core llega tal cual, con su ProblemDetail", async () => {
    const http = fakeHttp();
    const conflict = HttpError.fromResponse(409, {
      type: "about:blank",
      title: "Conflict",
      status: 409,
      detail: "El email ya está registrado",
    });
    http.post.mockRejectedValue(conflict);

    await expect(new SignUpService(http, () => "v1.1.x").signUp(request)).rejects.toBe(conflict);
  });
});
