import { IconLoUsers } from "@playtopia/icons/react-native";
import { render, screen } from "@testing-library/react-native";

import { StatTile } from "@/features/schedule/components/StatTile";
import { darkTheme } from "@/shared/config/theme";

describe("StatTile", () => {
  it("el valor y lo que es; el lector de pantalla lo dice junto", () => {
    render(<StatTile Icon={IconLoUsers} value="2/4" label="Alumnos" />);

    expect(screen.getByLabelText("Alumnos: 2/4")).toBeTruthy();
    expect(screen.getByText("2/4", { includeHiddenElements: true })).toBeTruthy();
  });

  it("en el detalle, la cifra en blanco sobre el degradado", () => {
    render(<StatTile Icon={IconLoUsers} value="2/4" label="Alumnos" />);

    expect(screen.getByText("2/4", { includeHiddenElements: true })).toHaveStyle({ color: darkTheme.colors.onPrimary });
  });

  it("encima de la agenda, la cifra en su color y lo que es en gris, en una línea", () => {
    render(<StatTile variant="today" color={darkTheme.accents.sky.color} Icon={IconLoUsers} value="14" label="alumnos hoy" />);

    expect(screen.getByLabelText("alumnos hoy: 14")).toBeTruthy();
    expect(screen.getByText("14", { includeHiddenElements: true })).toHaveStyle({ color: darkTheme.accents.sky.color });
    const label = screen.getByText("alumnos hoy", { includeHiddenElements: true });
    expect(label).toHaveStyle({ color: darkTheme.colors.textSecondary });
    expect(label.props.numberOfLines).toBe(1);
  });
});
