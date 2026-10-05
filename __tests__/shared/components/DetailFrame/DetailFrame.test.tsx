import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { DetailFrame } from "@/shared/components/DetailFrame";

describe("DetailFrame", () => {
  it("su contenido sobre el fondo de marca, y su panel aparte", () => {
    render(
      <DetailFrame testID="detail" sheet={<Text>Panel</Text>}>
        <Text>Contenido</Text>
      </DetailFrame>,
    );

    expect(screen.getByTestId("detail")).toBeTruthy();
    expect(screen.getByText("Contenido")).toBeTruthy();
    expect(screen.getByText("Panel")).toBeTruthy();
  });
});
