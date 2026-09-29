import { render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { ClubDot } from "@/features/schedule/components/ClubDot";

describe("ClubDot", () => {
  it("un punto redondo del color del club", () => {
    render(<ClubDot color="#0EA5E9" />);

    const style = StyleSheet.flatten(screen.getByTestId("club-dot").props.style);
    expect(style).toMatchObject({ backgroundColor: "#0EA5E9", borderRadius: style.width / 2 });
  });
});
