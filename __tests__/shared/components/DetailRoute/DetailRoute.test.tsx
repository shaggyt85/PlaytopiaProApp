import { render, screen } from "@testing-library/react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text } from "react-native";
import { z } from "zod";

import { DetailRoute } from "@/shared/components/DetailRoute";

jest.mock("expo-router", () => ({ useLocalSearchParams: jest.fn(), useRouter: jest.fn() }));

const schema = z.object({ id: z.coerce.number().int().positive() });
const open = (params: Record<string, string>) => {
  jest.mocked(useLocalSearchParams).mockReturnValue(params);
  render(
    <DetailRoute schema={schema} testID="thing-screen" notFound="Cosa no encontrada">
      {({ id }) => <Text>{`La cosa ${id}`}</Text>}
    </DetailRoute>,
  );
};

describe("DetailRoute", () => {
  beforeEach(() => jest.mocked(useRouter).mockReturnValue({ back: jest.fn(), canGoBack: () => true } as never));

  it("con unos parámetros válidos, la pantalla con ellos ya convertidos", () => {
    open({ id: "7" });

    expect(screen.getByText("La cosa 7")).toBeTruthy();
  });

  it("si no valen, su «no encontrado» con «Volver», en su marco", () => {
    open({ id: "x" });

    expect(screen.getByTestId("thing-screen")).toBeTruthy();
    expect(screen.getByText("Cosa no encontrada")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Volver" })).toBeTruthy();
  });
});
