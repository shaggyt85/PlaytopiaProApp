import { skipToken } from "@tanstack/react-query";

import { CachePolicy } from "@/shared/config/cachePolicies";
import {
  TeacherProfileService,
  teacherKeys,
  teacherProfileQuery,
} from "@/shared/services/teacherProfileService";

import { createFakeHttpClient as fakeHttp } from "../../helpers/fakeHttpClient";

// Core devuelve el TeacherResponse entero; la app solo se queda con lo que usa.
const teacher = {
  id: 42,
  name: "David",
  last_name: "García",
  email: "david@club.com",
  terms_version: null,
  accepted_terms_at: null,
};

describe("TeacherProfileService", () => {
  it("lee el perfil del profesor", async () => {
    const http = fakeHttp(teacher);

    const result = await new TeacherProfileService(http).get(42);

    expect(http.get).toHaveBeenCalledWith("/UserTeacher/42");
    expect(result).toEqual({ id: 42, name: "David", terms_version: null, accepted_terms_at: null });
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

  it("la clave de caché del perfil lleva el id del profesor", () => {
    expect(teacherKeys.profile(42)).toEqual(["teacher", "profile", 42]);
  });

  it("la receta de la query: su clave, cómo se pide y la caché STANDARD", async () => {
    const service = { get: jest.fn().mockResolvedValue("perfil") };
    const query = teacherProfileQuery(42, service);

    expect(query.queryKey).toEqual(["teacher", "profile", 42]);
    expect(query.staleTime).toBe(CachePolicy.STANDARD.staleTime);
    expect(query.queryFn).not.toBe(skipToken);
  });

  it("sin profesor la receta no pide nada", () => {
    expect(teacherProfileQuery(undefined).queryFn).toBe(skipToken);
  });
});
