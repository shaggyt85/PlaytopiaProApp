import { skipToken } from "@tanstack/react-query";

import { CachePolicy } from "@/shared/config/cachePolicies";
import {
  MyClubsService,
  myClubsKeys,
  myClubsQuery,
  type IMyClubsService,
} from "@/shared/services/myClubsService";
import { MyClubsResponseSchema } from "@/shared/schemas/schoolCard.schema";

import { createFakeHttpClient as fakeHttp } from "../../helpers/fakeHttpClient";
import { schoolCard } from "../../helpers/networkFactories";

describe("MyClubsService", () => {
  it("pide sus clubes a /MobileTeacher/clubs y valida la respuesta", async () => {
    const card = schoolCard(4, 7);
    const http = fakeHttp({ clubs: [card] });

    const result = await new MyClubsService(http).getMyClubs();

    expect(http.get).toHaveBeenCalledWith("/MobileTeacher/clubs", MyClubsResponseSchema);
    expect(result.clubs).toEqual([card]);
  });

  it("una respuesta que no cumple el contrato falla", async () => {
    await expect(new MyClubsService(fakeHttp({ clubs: "ninguno" })).getMyClubs()).rejects.toThrow();
  });
});

describe("myClubsKeys", () => {
  it("cada profesor tiene su propia caché", () => {
    expect(myClubsKeys.of(1)).not.toEqual(myClubsKeys.of(2));
    expect(myClubsKeys.of(1).slice(0, 1)).toEqual(myClubsKeys.all);
  });
});

describe("myClubsQuery", () => {
  const service: IMyClubsService = { getMyClubs: jest.fn().mockResolvedValue({ clubs: [] }) };

  it("pide sus clubes con la caché STANDARD", () => {
    const recipe = myClubsQuery(1, service);
    expect(recipe.queryKey).toEqual(myClubsKeys.of(1));
    expect(recipe.staleTime).toBe(CachePolicy.STANDARD.staleTime);
  });

  it("sin profesor en sesión no pide nada", () => {
    expect(myClubsQuery(undefined, service).queryFn).toBe(skipToken);
  });
});
