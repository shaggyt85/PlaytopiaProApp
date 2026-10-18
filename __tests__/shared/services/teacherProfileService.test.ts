import { skipToken } from "@tanstack/react-query";

import { CachePolicy } from "@/shared/config/cachePolicies";
import {
  TeacherProfileService,
  teacherKeys,
  teacherProfileQuery,
} from "@/shared/services/teacherProfileService";

import { createFakeHttpClient as fakeHttp } from "../../helpers/fakeHttpClient";
import { teacherProfile, teacherProfileResponse } from "../../helpers/profileFactories";

// Core devuelve el perfil entero; la app solo se queda con lo que usa.
const teacher = teacherProfileResponse({ terms_version: null, accepted_terms_at: null });

describe("TeacherProfileService", () => {
  it("lee el perfil del profesor", async () => {
    const http = fakeHttp(teacher);

    const result = await new TeacherProfileService(http).get(42);

    expect(http.get).toHaveBeenCalledWith("/UserTeacher/42");
    expect(result).toEqual(teacherProfile({ terms_version: null, accepted_terms_at: null }));
  });

  it("actualiza con un PATCH al mismo perfil y devuelve el perfil nuevo", async () => {
    const http = fakeHttp({ ...teacher, terms_version: "2026-07-01", accepted_terms_at: "2026-09-26T10:00:00" });

    const result = await new TeacherProfileService(http).update(42, { terms_version: "2026-07-01" });

    expect(http.patch).toHaveBeenCalledWith("/UserTeacher/42", { terms_version: "2026-07-01" });
    expect(result.terms_version).toBe("2026-07-01");
  });

  it("una respuesta sin los campos que usa la app no cumple el contrato", async () => {
    const http = fakeHttp({ id: 42 });

    await expect(new TeacherProfileService(http).get(42)).rejects.toThrow();
  });

  it("la clave de caché del perfil lleva el id del profesor y el idioma (los deportes los traduce Core)", () => {
    expect(teacherKeys.profile(42, "es")).toEqual(["teacher", "profile", 42, "es"]);
  });

  it("la receta de la query: su clave, cómo se pide y la caché LIVE (los términos al volver a la app)", async () => {
    const service = { get: jest.fn().mockResolvedValue("perfil") };
    const query = teacherProfileQuery(42, "es", service);

    expect(query.queryKey).toEqual(["teacher", "profile", 42, "es"]);
    expect(query.staleTime).toBe(CachePolicy.LIVE.staleTime);
    expect(query.queryFn).not.toBe(skipToken);
  });

  it("sin profesor la receta no pide nada", () => {
    expect(teacherProfileQuery(undefined, "es").queryFn).toBe(skipToken);
  });
});
