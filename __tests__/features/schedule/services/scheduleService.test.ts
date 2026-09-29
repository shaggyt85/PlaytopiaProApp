import { skipToken } from "@tanstack/react-query";

import {
  ScheduleService,
  scheduleKeys,
  scheduleQuery,
  type IScheduleService,
} from "@/features/schedule/services/scheduleService";
import { CachePolicy } from "@/shared/config/cachePolicies";

import { createFakeHttpClient as fakeHttp } from "../../../helpers/fakeHttpClient";
import { scheduleResponse } from "../../../helpers/scheduleFactories";

describe("ScheduleService", () => {
  it("pide las clases del rango a /MobileTeacher/classes y valida la respuesta", async () => {
    const body = scheduleResponse();
    const http = fakeHttp(body);

    const result = await new ScheduleService(http).getClasses("2026-10-05", "2026-10-11");

    expect(http.get).toHaveBeenCalledWith("/MobileTeacher/classes", {
      params: { from: "2026-10-05", to: "2026-10-11" },
    });
    expect(result).toEqual(body);
  });

  it("una respuesta que no cumple el contrato falla", async () => {
    await expect(
      new ScheduleService(fakeHttp({ classes: "ninguna" })).getClasses("2026-10-05", "2026-10-05"),
    ).rejects.toThrow();
  });
});

describe("scheduleKeys", () => {
  it("cada profesor y cada rango tienen su propia caché", () => {
    const week = scheduleKeys.classes(1, "2026-10-05", "2026-10-11");
    expect(scheduleKeys.classes(2, "2026-10-05", "2026-10-11")).not.toEqual(week);
    expect(scheduleKeys.classes(1, "2026-10-12", "2026-10-18")).not.toEqual(week);
  });

  it("todas cuelgan de la misma raíz, para poder invalidarlas juntas", () => {
    expect(scheduleKeys.classes(1, "2026-10-05", "2026-10-11").slice(0, 1)).toEqual(scheduleKeys.all);
  });
});

describe("scheduleQuery", () => {
  const service: IScheduleService = { getClasses: jest.fn().mockResolvedValue(scheduleResponse()) };

  it("pide el rango al servicio con la caché LIVE", async () => {
    const recipe = scheduleQuery(1, "2026-10-05", "2026-10-11", service);

    expect(recipe.queryKey).toEqual(scheduleKeys.classes(1, "2026-10-05", "2026-10-11"));
    expect(recipe.staleTime).toBe(CachePolicy.LIVE.staleTime);
    expect(recipe.refetchOnWindowFocus).toBe(true);
    const queryFn = recipe.queryFn as () => Promise<unknown>;
    await queryFn();
    expect(service.getClasses).toHaveBeenCalledWith("2026-10-05", "2026-10-11");
  });

  it("sin profesor en sesión no pide nada", () => {
    expect(scheduleQuery(undefined, "2026-10-05", "2026-10-11", service).queryFn).toBe(skipToken);
  });
});
