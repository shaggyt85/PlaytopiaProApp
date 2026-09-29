import { render, screen } from "@testing-library/react-native";

import { ClubLegend } from "@/features/schedule/components/ClubLegend";
import { darkTheme } from "@/shared/config/theme";

const clubs = [
  { key: "4-7", label: "Indoor MAD", colors: darkTheme.clubColors[0] },
  { key: "5-1", label: "Reset", colors: darkTheme.clubColors[1] },
];

describe("ClubLegend", () => {
  it("«CLUBES» y una pastilla por club, en su orden", () => {
    render(<ClubLegend clubs={clubs} />);

    expect(screen.getByText("Clubes")).toBeTruthy();
    expect(screen.getAllByTestId("club-badge")).toHaveLength(2);
    expect(screen.getByText("Indoor MAD")).toBeTruthy();
    expect(screen.getByText("Reset")).toBeTruthy();
  });

  it("sin clubes no sale", () => {
    render(<ClubLegend clubs={[]} />);

    expect(screen.queryByTestId("club-legend")).toBeNull();
  });
});
