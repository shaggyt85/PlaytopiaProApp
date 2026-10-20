import { skipToken } from "@tanstack/react-query";

import {
  GroupAttendanceService,
  groupAttendanceKeys,
  groupAttendanceQuery,
} from "@/features/groups/services/groupAttendanceService";
import { CachePolicy } from "@/shared/config/cachePolicies";
import { scheduleKeys } from "@/shared/services/scheduleService";
import { GroupAttendanceResponseSchema } from "@/features/groups/schemas/groupAttendance.schema";

import { createFakeHttpClient as fakeHttp } from "../../../helpers/fakeHttpClient";
import { studentAttendance } from "../../../helpers/groupAttendanceFactories";

describe("GroupAttendanceService", () => {
  it("pide el historial a /MobileTeacher/classes/{db_id}/{class_id}/group-attendance y devuelve sus alumnos", async () => {
    const students = [studentAttendance()];
    const http = fakeHttp({ students });

    const result = await new GroupAttendanceService(http).getGroupAttendance(4, 31);

    expect(http.get).toHaveBeenCalledWith("/MobileTeacher/classes/4/31/group-attendance", GroupAttendanceResponseSchema);
    expect(result).toEqual(students);
  });

  it("una respuesta que no cumple el contrato falla", async () => {
    await expect(new GroupAttendanceService(fakeHttp({ alumnos: [] })).getGroupAttendance(4, 31)).rejects.toThrow();
  });
});

describe("groupAttendanceKeys", () => {
  it("una por grupo y profesor: la clase con la que se pide no cuenta", () => {
    const group = groupAttendanceKeys.of(1, 4, 11);

    expect(groupAttendanceKeys.of(2, 4, 11)).not.toEqual(group);
    expect(groupAttendanceKeys.of(1, 5, 11)).not.toEqual(group);
    expect(groupAttendanceKeys.of(1, 4, 12)).not.toEqual(group);
  });

  it("cuelgan de la raíz de la agenda: pasar lista las invalida", () => {
    expect(groupAttendanceKeys.of(1, 4, 11).slice(0, 1)).toEqual(scheduleKeys.all);
  });
});

describe("groupAttendanceQuery", () => {
  it("la pide con una clase del grupo y la caché STANDARD; sin profesor, nada", async () => {
    const getGroupAttendance = jest.fn().mockResolvedValue([]);
    const target = { dbId: 4, groupId: 11, classId: 31 };
    const recipe = groupAttendanceQuery(1, target, { getGroupAttendance });

    expect(recipe.queryKey).toEqual(groupAttendanceKeys.of(1, 4, 11));
    expect(recipe.staleTime).toBe(CachePolicy.STANDARD.staleTime);
    await (recipe.queryFn as () => Promise<unknown>)();
    expect(getGroupAttendance).toHaveBeenCalledWith(4, 31);
    expect(groupAttendanceQuery(undefined, target, { getGroupAttendance }).queryFn).toBe(skipToken);
  });
});
