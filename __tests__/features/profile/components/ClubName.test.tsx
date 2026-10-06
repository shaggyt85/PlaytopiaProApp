import { render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { ClubName } from "@/features/profile/components/ClubName";
import { darkTheme } from "@/shared/config/theme";

describe("ClubName", () => {
  it("el punto de su color y su nombre", () => {
    render(<ClubName club={{ label: "Indoor Centro", colors: darkTheme.clubColors[1] }} />);

    expect(screen.getByText("Indoor Centro")).toBeTruthy();
    expect(StyleSheet.flatten(screen.getByTestId("club-dot").props.style).backgroundColor).toBe(
      darkTheme.clubColors[1].color,
    );
  });
});
