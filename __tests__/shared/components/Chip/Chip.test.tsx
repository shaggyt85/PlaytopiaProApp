import { render, screen } from "@testing-library/react-native";

import { Chip } from "@/shared/components/Chip";

describe("Chip", () => {
  it("muestra su texto en una sola línea", () => {
    render(<Chip label="Sede Centro" />);

    expect(screen.getByText("Sede Centro").props.numberOfLines).toBe(1);
  });
});
