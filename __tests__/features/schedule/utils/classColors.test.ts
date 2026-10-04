import { classColors } from "@/features/schedule/utils/classColors";
import { darkTheme } from "@/shared/config/theme";

const palette = darkTheme.clubColors;
const lesson = (id: number, class_time: string) => ({ id, class_time });

describe("classColors", () => {
  it("cada clase su color, por su hora y en ciclo", () => {
    const colors = classColors([lesson(7, "18:00:00"), lesson(3, "09:00:00"), lesson(5, "12:00:00")], palette);

    expect(colors.get(3)).toBe(palette[0]);
    expect(colors.get(5)).toBe(palette[1]);
    expect(colors.get(7)).toBe(palette[2]);
  });

  it("dos a la misma hora: por su id", () => {
    const colors = classColors([lesson(9, "18:00:00"), lesson(4, "18:00:00")], palette);

    expect(colors.get(4)).toBe(palette[0]);
    expect(colors.get(9)).toBe(palette[1]);
  });

  it("con más clases que colores, vuelve a empezar", () => {
    const many = Array.from({ length: palette.length + 1 }, (_, i) => lesson(i + 1, `${String(8 + i).padStart(2, "0")}:00:00`));

    expect(classColors(many, palette).get(palette.length + 1)).toBe(palette[0]);
  });
});
