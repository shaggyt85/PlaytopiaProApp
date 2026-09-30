import { render, screen } from "@testing-library/react-native";

import { SectionLabel } from "@/features/schedule/components/SectionLabel";

describe("SectionLabel", () => {
  it("el título de una sección, como cabecera para el lector de pantalla", () => {
    render(<SectionLabel label="Club" />);

    expect(screen.getByRole("header", { name: "Club" })).toBeTruthy();
  });
});
