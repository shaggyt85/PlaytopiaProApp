import { studentName } from "@/shared/utils/studentName";

describe("studentName", () => {
  it("el nombre y el apellido", () => {
    expect(studentName({ name: "Lucía", last_name: "Romero" })).toBe("Lucía Romero");
  });

  it("sin apellido, sin espacios de más", () => {
    expect(studentName({ name: "Lucía", last_name: " " })).toBe("Lucía");
  });
});
