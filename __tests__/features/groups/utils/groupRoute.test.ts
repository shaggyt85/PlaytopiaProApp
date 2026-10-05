import { GroupDetailParamsSchema, groupDetailHref } from "@/features/groups/utils/groupRoute";

describe("groupRoute", () => {
  it("lo que arma la ruta lo acepta su esquema", () => {
    const { pathname, params } = groupDetailHref(4, 11);

    expect(pathname).toBe("/group/[dbId]/[groupId]");
    expect(GroupDetailParamsSchema.parse(params)).toEqual({ dbId: 4, groupId: 11 });
  });

  it("unos parámetros que no son de un grupo no pasan", () => {
    expect(GroupDetailParamsSchema.safeParse({ dbId: "x", groupId: "11" }).success).toBe(false);
    expect(GroupDetailParamsSchema.safeParse({ dbId: "4" }).success).toBe(false);
  });
});
