// eslint-disable-next-line @typescript-eslint/no-require-imports
const { bumpVersion } = require("../../scripts/release");

describe("bumpVersion", () => {
  it("patch sube el último número", () => {
    expect(bumpVersion("1.0.0", "patch")).toBe("1.0.1");
  });

  it("minor sube el del medio y pone el patch a cero", () => {
    expect(bumpVersion("1.0.9", "minor")).toBe("1.1.0");
  });

  it("major sube el primero y pone los otros dos a cero", () => {
    expect(bumpVersion("1.4.2", "major")).toBe("2.0.0");
  });

  it("compara números y no texto: 1.0.9 pasa a 1.0.10", () => {
    expect(bumpVersion("1.0.9", "patch")).toBe("1.0.10");
  });

  it("rechaza un tipo de subida que no existe", () => {
    expect(() => bumpVersion("1.0.0", "build")).toThrow(/patch, minor, major/);
  });

  it("rechaza una versión que no es MAJOR.MINOR.PATCH", () => {
    expect(() => bumpVersion("1.0", "patch")).toThrow(/MAJOR.MINOR.PATCH/);
  });
});
