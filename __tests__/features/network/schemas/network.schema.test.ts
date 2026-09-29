import {
  JoinableSchoolsResponseSchema,
  MyClubsResponseSchema,
  SchoolCardSchema,
} from "@/features/network/schemas/network.schema";

const card = {
  db_id: 4,
  club_id: 7,
  name: "DN Padel Academy",
  club_name: "Sede Centro",
  city: "Sevilla",
  address: "Calle Mayor 3",
  background_url: "https://core-dev.playtopiax.com/api/img/defaults/default_background.jpg?e=1&s=x",
};

describe("SchoolCardSchema", () => {
  it("acepta la tarjeta tal como la manda Core", () => {
    expect(SchoolCardSchema.parse(card)).toEqual(card);
  });

  it("una sede sin nombre propio llega con club_name a null", () => {
    expect(SchoolCardSchema.parse({ ...card, club_name: null }).club_name).toBeNull();
  });

  it("sin portada no cumple el contrato: Core la manda siempre", () => {
    const { background_url: _omitida, ...sinPortada } = card;
    expect(() => SchoolCardSchema.parse(sinPortada)).toThrow();
    expect(() => SchoolCardSchema.parse({ ...card, background_url: null })).toThrow();
  });

  it("un id que no es un número entero no cumple el contrato", () => {
    expect(() => SchoolCardSchema.parse({ ...card, db_id: "4" })).toThrow();
    expect(() => SchoolCardSchema.parse({ ...card, club_id: 7.5 })).toThrow();
  });
});

describe("MyClubsResponseSchema", () => {
  it("trae la lista de sus sedes, vacía si aún no trabaja en ninguna", () => {
    expect(MyClubsResponseSchema.parse({ clubs: [card] }).clubs).toHaveLength(1);
    expect(MyClubsResponseSchema.parse({ clubs: [] }).clubs).toEqual([]);
  });
});

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
