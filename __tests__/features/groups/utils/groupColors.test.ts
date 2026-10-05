import { groupColors } from "@/features/groups/utils/groupColors";
import { darkTheme } from "@/shared/config/theme";

const palette = darkTheme.clubColors;

describe("groupColors", () => {
  it("por el id del grupo, en ciclo sobre la paleta: el mismo en la lista y en su detalle", () => {
    expect(groupColors({ group_id: 2, id: 31 }, palette)).toBe(palette[2]);
    expect(groupColors({ group_id: palette.length + 1, id: 31 }, palette)).toBe(palette[1]);
  });

  it("una clase antigua sin grupo, por su id", () => {
    expect(groupColors({ group_id: null, id: 3 }, palette)).toBe(palette[3]);
  });
});
