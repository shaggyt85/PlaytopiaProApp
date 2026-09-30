import { IconLoUsers } from "@playtopia/icons/react-native";
import { render, screen } from "@testing-library/react-native";

import { StatTile } from "@/features/schedule/components/StatTile";

describe("StatTile", () => {
  it("el valor y lo que es; el lector de pantalla lo dice junto", () => {
    render(<StatTile Icon={IconLoUsers} value="2/4" label="Alumnos" />);

    expect(screen.getByLabelText("Alumnos: 2/4")).toBeTruthy();
    expect(screen.getByText("2/4", { includeHiddenElements: true })).toBeTruthy();
  });
});
