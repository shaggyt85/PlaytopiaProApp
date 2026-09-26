import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { BrandBackground } from "@/shared/components/BrandBackground";

describe("BrandBackground", () => {
  it("pinta su contenido encima del fondo de marca", () => {
    render(
      <BrandBackground testID="fondo">
        <Text>contenido</Text>
      </BrandBackground>,
    );

    expect(screen.getByTestId("fondo")).toBeTruthy();
    expect(screen.getByText("contenido")).toBeTruthy();
  });
});
