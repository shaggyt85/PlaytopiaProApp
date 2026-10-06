import { render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { ClubDot } from "@/shared/components/ClubDot";

describe("ClubDot", () => {
  it("un punto redondo de 8 del color que se le dé", () => {
    render(<ClubDot color="#FFFFFF" />);

    expect(StyleSheet.flatten(screen.getByTestId("club-dot").props.style)).toMatchObject({
      backgroundColor: "#FFFFFF",
      width: 8,
      height: 8,
      borderRadius: 4,
    });
  });
});
