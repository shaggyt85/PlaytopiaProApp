import { groupPlace } from "@/features/groups/utils/groupPlace";

describe("groupPlace", () => {
  it("la sede y la pista", () => {
    expect(groupPlace({ track_name: "Pista 1" }, "Sede Centro")).toBe("Sede Centro · Pista 1");
  });

  it("si la sede ya no está en «Mis clubes», solo la pista", () => {
    expect(groupPlace({ track_name: "Pista 1" }, "")).toBe("Pista 1");
  });
});
