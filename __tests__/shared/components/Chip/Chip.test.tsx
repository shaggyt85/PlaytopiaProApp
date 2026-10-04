import { render, screen } from "@testing-library/react-native";

import { Chip } from "@/shared/components/Chip";
import { darkTheme } from "@/shared/config/theme";

describe("Chip", () => {
  it("muestra su texto en una sola línea", () => {
    render(<Chip label="Sede Centro" />);

    expect(screen.getByText("Sede Centro").props.numberOfLines).toBe(1);
  });
});

describe("Chip sin punto", () => {
  it("con punto por defecto; sin él, solo el texto", () => {
    const { rerender } = render(<Chip label="Hoy · 23:10" />);
    expect(screen.getByTestId("chip-dot")).toBeTruthy();

    rerender(<Chip label="Hoy · 23:10" dot={false} />);
    expect(screen.queryByTestId("chip-dot")).toBeNull();
    expect(screen.getByText("Hoy · 23:10")).toBeTruthy();
  });
});

describe("Chip en oro", () => {
  it("de marca por defecto; en oro, el texto y el punto en oro (la etiqueta de recuperación)", () => {
    const { rerender } = render(<Chip label="Sede Centro" />);
    expect(screen.getByText("Sede Centro")).toHaveStyle({ color: darkTheme.colors.primary });

    rerender(<Chip label="Recuperación" tone="gold" />);
    expect(screen.getByText("Recuperación")).toHaveStyle({ color: darkTheme.accents.gold.color });
    expect(screen.getByTestId("chip-dot")).toHaveStyle({ backgroundColor: darkTheme.accents.gold.color });
  });
});
