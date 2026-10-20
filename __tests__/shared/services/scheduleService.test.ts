import { skipToken } from "@tanstack/react-query";

import { CachePolicy } from "@/shared/config/cachePolicies";
import {
  previousClassQuery,
  ScheduleService,
  scheduleKeys,
  scheduleQuery,
  type ScheduleReader,
} from "@/shared/services/scheduleService";
import { AttendanceMarkSchema } from "@/shared/schemas/schedule.schema";
import { PreviousClassResponseSchema, ScheduleResponseSchema } from "@/shared/schemas/schedule.schema";

import { createFakeHttpClient as fakeHttp } from "../../helpers/fakeHttpClient";
import { attendanceMark, scheduleClass, scheduleResponse } from "../../helpers/scheduleFactories";

describe("ScheduleService", () => {
  it("pide las clases del rango a /MobileTeacher/classes y valida la respuesta", async () => {
    const body = scheduleResponse();
    const http = fakeHttp(body);

    const result = await new ScheduleService(http).getClasses("2026-10-05", "2026-10-11");

    expect(http.get).toHaveBeenCalledWith("/MobileTeacher/classes", ScheduleResponseSchema, {
      params: { from: "2026-10-05", to: "2026-10-11" },
    });
    expect(result).toEqual(body);
  });

  it("una respuesta que no cumple el contrato falla", async () => {
    await expect(
      new ScheduleService(fakeHttp({ classes: "ninguna" })).getClasses("2026-10-05", "2026-10-05"),
    ).rejects.toThrow();
  });

  it("marca la asistencia con PUT en la clase del alumno y valida la marca guardada", async () => {
    const body = attendanceMark({ status: "absent" });
    const http = fakeHttp(body);

    const result = await new ScheduleService(http).markAttendance(
      { dbId: 4, classId: 90, studentId: 55 },
      "absent",
    );

    expect(http.put).toHaveBeenCalledWith("/MobileTeacher/classes/4/90/attendance/55", { status: "absent" }, AttendanceMarkSchema);
    expect(result).toEqual(body);
  });

  it("una marca que no cumple el contrato falla", async () => {
    await expect(
      new ScheduleService(fakeHttp({ status: "late" })).markAttendance({ dbId: 4, classId: 31, studentId: 55 }, "present"),
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
    expect(scheduleKeys.previous(1, 4, 31).slice(0, 1)).toEqual(scheduleKeys.all);
  });

  it("las agendas cuelgan además de la suya; la clase anterior no, que tiene otra forma", () => {
    expect(scheduleKeys.classes(1, "2026-10-05", "2026-10-11").slice(0, 2)).toEqual(scheduleKeys.agendas);
    expect(scheduleKeys.previous(1, 4, 31).slice(0, 2)).not.toEqual(scheduleKeys.agendas);
  });
});

describe("ScheduleService: la clase anterior del grupo", () => {
  it("la pide a /MobileTeacher/classes/{db_id}/{class_id}/previous y devuelve la clase", async () => {
    const previous = scheduleClass({ id: 30 });
    const http = fakeHttp({ previous_class: previous });

    const result = await new ScheduleService(http).getPreviousClass(4, 31);

    expect(http.get).toHaveBeenCalledWith("/MobileTeacher/classes/4/31/previous", PreviousClassResponseSchema);
    expect(result).toEqual(previous);
  });

  it("si es la primera del grupo, null", async () => {
    expect(await new ScheduleService(fakeHttp({ previous_class: null })).getPreviousClass(4, 31)).toBeNull();
  });

  it("una respuesta que no cumple el contrato falla", async () => {
    await expect(new ScheduleService(fakeHttp({ previous: [] })).getPreviousClass(4, 31)).rejects.toThrow();
  });
});

describe("previousClassQuery", () => {
  it("la pide al servicio con la caché STANDARD; sin profesor, nada", async () => {
    const getPreviousClass = jest.fn().mockResolvedValue(null);
    const recipe = previousClassQuery(1, 4, 31, { getPreviousClass });

    expect(recipe.queryKey).toEqual(scheduleKeys.previous(1, 4, 31));
    expect(recipe.staleTime).toBe(CachePolicy.STANDARD.staleTime);
    await (recipe.queryFn as () => Promise<unknown>)();
    expect(getPreviousClass).toHaveBeenCalledWith(4, 31);
    expect(previousClassQuery(undefined, 4, 31, { getPreviousClass }).queryFn).toBe(skipToken);
  });
});

describe("scheduleQuery", () => {
  const service: ScheduleReader = { getClasses: jest.fn().mockResolvedValue(scheduleResponse()) };

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
