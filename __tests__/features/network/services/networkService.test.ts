import {
  JOINABLE_SCHOOLS_PAGE_SIZE,
  NetworkService,
  networkKeys,
} from "@/features/network/services/networkService";

import { createFakeHttpClient as fakeHttp } from "../../../helpers/fakeHttpClient";

const card = {
  db_id: 4,
  club_id: 7,
  name: "DN Padel Academy",
  club_name: null,
  city: "Sevilla",
  address: "Calle Mayor 3",
  background_url: "https://core-dev.playtopiax.com/api/img/schools/4/background/x.jpg?e=1&s=x",
};

describe("NetworkService", () => {
  it("pide la página de sedes con su tamaño, sin depender del defecto de Core", async () => {
    const pagination = { page: 3, size: 10, total_count: 25, total_pages: 3 };
    const http = fakeHttp({ schools: [card], pagination });

    const result = await new NetworkService(http).getJoinableSchools(3);

    expect(http.get).toHaveBeenCalledWith("/MobileTeacher/schools", {
      params: { page: 3, size: JOINABLE_SCHOOLS_PAGE_SIZE },
    });
    expect(result).toEqual({ schools: [card], pagination });
  });

  it("una respuesta que no cumple el contrato falla", async () => {
    await expect(
      new NetworkService(fakeHttp({ schools: [card] })).getJoinableSchools(1),
    ).rejects.toThrow();
  });
});

describe("networkKeys", () => {
  it("cada profesor tiene su propia caché, bajo la raíz de «Red de clubes»", () => {
    expect(networkKeys.joinableSchools(1)).not.toEqual(networkKeys.joinableSchools(2));
    expect(networkKeys.joinableSchools(1).slice(0, 1)).toEqual(networkKeys.all);
  });
});
