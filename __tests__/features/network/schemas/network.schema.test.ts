import { JoinableSchoolsResponseSchema } from "@/features/network/schemas/network.schema";

const card = {
  db_id: 4,
  club_id: 7,
  name: "DN Padel Academy",
  club_name: "Sede Centro",
  city: "Sevilla",
  address: "Calle Mayor 3",
  background_url: "https://core-dev.playtopiax.com/api/img/defaults/default_background.jpg?e=1&s=x",
};

describe("JoinableSchoolsResponseSchema", () => {
  const pagination = { page: 1, size: 10, total_count: 1, total_pages: 1 };

  it("trae una página de sedes y su paginación", () => {
    expect(JoinableSchoolsResponseSchema.parse({ schools: [card], pagination })).toEqual({
      schools: [card],
      pagination,
    });
  });

  it("sin paginación completa no cumple el contrato", () => {
    const { total_pages: _omitido, ...incompleta } = pagination;
    expect(() =>
      JoinableSchoolsResponseSchema.parse({ schools: [], pagination: incompleta }),
    ).toThrow();
  });
});
