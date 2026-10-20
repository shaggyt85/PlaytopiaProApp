import { skipToken } from "@tanstack/react-query";

import {
  PROFILE_INCLUDES,
  ProfileDetailsService,
  profileDetailsQuery,
  profileKeys,
} from "@/features/profile/services/profileDetailsService";
import { CachePolicy } from "@/shared/config/cachePolicies";
import { HttpError } from "@/shared/services/HttpError";
import { teacherKeys } from "@/shared/services/teacherProfileService";
import { ProfileDetailsSchema } from "@/features/profile/schemas/profileDetails.schema";

import { createFakeHttpClient as fakeHttp } from "../../../helpers/fakeHttpClient";
import { profileDetails, teacherProfileResponse } from "../../../helpers/profileFactories";

const coreResponse = () => {
  const { hours, availability } = profileDetails();
  return { ...teacherProfileResponse(), hours, availability };
};

describe("ProfileDetailsService", () => {
  it("pide el mismo perfil con sus horas y su disponibilidad", async () => {
    const http = fakeHttp(coreResponse());

    const result = await new ProfileDetailsService(http).get(42);

    expect(http.get).toHaveBeenCalledWith("/UserTeacher/42", ProfileDetailsSchema, { params: { include: "hours,availability" } });
    expect(result).toEqual(profileDetails());
  });

  it("los apartados que pide son los de PROFILE_INCLUDES", () => {
    expect(PROFILE_INCLUDES).toEqual(["hours", "availability"]);
  });

  it("una respuesta sin las horas no cumple el contrato", async () => {
    const { hours: _hours, ...withoutHours } = coreResponse();

    await expect(new ProfileDetailsService(fakeHttp(withoutHours)).get(42)).rejects.toThrow();
  });

  it("propaga el HttpError de Core tal cual", async () => {
    const error = HttpError.fromResponse(403, {
      type: "urn:playtopia:problem:forbidden",
      title: "Forbidden",
      status: 403,
    });
    const http = fakeHttp();
    http.get.mockRejectedValue(error);

    await expect(new ProfileDetailsService(http).get(42)).rejects.toBe(error);
  });

  it("su clave cuelga del profesor y lleva el idioma", () => {
    const key = profileKeys.details(42, "es");

    expect(key).toEqual(["teacher", "details", 42, "es"]);
    expect(key.slice(0, teacherKeys.all.length)).toEqual([...teacherKeys.all]);
  });

  it("la receta: su clave, cómo se pide y la caché STANDARD", () => {
    const query = profileDetailsQuery(42, "es", { get: jest.fn() });

    expect(query.queryKey).toEqual(profileKeys.details(42, "es"));
    expect(query.staleTime).toBe(CachePolicy.STANDARD.staleTime);
    expect(query.queryFn).not.toBe(skipToken);
  });

  it("sin profesor la receta no pide nada", () => {
    expect(profileDetailsQuery(undefined, "es").queryFn).toBe(skipToken);
  });
});
