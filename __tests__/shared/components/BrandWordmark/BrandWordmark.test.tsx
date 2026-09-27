import { render, screen } from "@testing-library/react-native";

import { BrandWordmark } from "@/shared/components/BrandWordmark";

describe("BrandWordmark", () => {
  it("pinta la marca en mayúsculas y se anuncia como una imagen «Playtopia», no como título", () => {
    render(<BrandWordmark />);

    expect(screen.getByRole("image", { name: "Playtopia" })).toBeTruthy();
    expect(screen.queryByRole("header")).toBeNull();
    expect(screen.getByText("PLAYTOPIA", { includeHiddenElements: true })).toBeTruthy();
  });
});
