import { skipToken } from "@tanstack/react-query";

import {
  SportsCatalogService,
  sportsCatalogKeys,
  sportsCatalogQuery,
} from "@/features/profile/services/sportsCatalogService";
import { CachePolicy } from "@/shared/config/cachePolicies";

import { createFakeHttpClient as fakeHttp } from "../../../helpers/fakeHttpClient";

const CATALOG = [
  {
    code: "padel",
    name: "Pádel",
    specialties: [
      { code: "technique", name: "Técnica" },
      { code: "tactics", name: "Táctica" },
      { code: "competition", name: "Competición" },
    ],
  },
  { code: "tennis", name: "Tenis", specialties: [] },
];

describe("SportsCatalogService", () => {
  it("pide el catálogo y devuelve sus deportes", async () => {
    const http = fakeHttp({ sports: CATALOG });

    expect(await new SportsCatalogService(http).getCatalog()).toEqual(CATALOG);
    expect(http.get).toHaveBeenCalledWith("/MobileTeacher/sports");
  });

  it("una respuesta sin los nombres no cumple el contrato", async () => {
    const http = fakeHttp({ sports: [{ code: "padel", specialties: [] }] });

    await expect(new SportsCatalogService(http).getCatalog()).rejects.toThrow();
  });

  it("la receta: su clave por idioma (lo traduce Core) y la caché STATIC", () => {
    const query = sportsCatalogQuery("es", { getCatalog: jest.fn() });

    expect(query.queryKey).toEqual(sportsCatalogKeys.catalog("es"));
    expect(sportsCatalogKeys.catalog("en")).not.toEqual(sportsCatalogKeys.catalog("es"));
    expect(query.staleTime).toBe(CachePolicy.STATIC.staleTime);
    expect(query.queryFn).not.toBe(skipToken);
  });
});
