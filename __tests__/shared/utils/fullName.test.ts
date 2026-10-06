import { fullName } from "@/shared/utils/fullName";

describe("fullName", () => {
  it("el nombre y el apellido", () => {
    expect(fullName({ name: "Lucía", last_name: "Romero" })).toBe("Lucía Romero");
  });

  it("sin apellido, sin espacios de más", () => {
    expect(fullName({ name: "Lucía", last_name: " " })).toBe("Lucía");
  });
});
