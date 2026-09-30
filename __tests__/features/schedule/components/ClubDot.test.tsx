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

describe("ClubDot con aro", () => {
  it("lleva un borde para verse sobre su propio color", () => {
    render(<ClubDot color="#0EA5E9" ring />);

    expect(StyleSheet.flatten(screen.getByTestId("club-dot").props.style).borderWidth).toBe(1);
  });
});

describe("ClubDot grande", () => {
  it("el de la tarjeta del club, de 20", () => {
    render(<ClubDot color="#0EA5E9" size="lg" ring />);

    expect(StyleSheet.flatten(screen.getByTestId("club-dot").props.style)).toMatchObject({ width: 20, height: 20 });
  });
});
