import { initials } from "@/shared/utils/initials";

describe("initials", () => {
  it("la primera del nombre y la del apellido, en mayúsculas", () => {
    expect(initials({ name: "lucía", last_name: "Romero" })).toBe("LR");
  });

  it("con acentos y espacios de más", () => {
    expect(initials({ name: "  Álvaro", last_name: " Íñiguez" })).toBe("ÁÍ");
  });

  it("sin apellido, solo la del nombre", () => {
    expect(initials({ name: "Diego", last_name: "" })).toBe("D");
  });
});
