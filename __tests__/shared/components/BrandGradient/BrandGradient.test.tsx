import { render } from "@testing-library/react-native";

import { BrandGradient } from "@/shared/components/BrandGradient";
import { darkTheme } from "@/shared/config/theme";

const mockGradient = jest.fn();
jest.mock("expo-linear-gradient", () => ({
  LinearGradient: (props: Record<string, unknown>) => {
    mockGradient(props);
    return null;
  },
}));

describe("BrandGradient", () => {
  it("pinta el degradado de marca a 135°, de arriba a la izquierda a abajo a la derecha", () => {
    render(<BrandGradient />);

    expect(mockGradient).toHaveBeenCalledWith(
      expect.objectContaining({
        colors: darkTheme.gradients.brand,
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
      }),
    );
  });

  it("apagado, el mismo ángulo en gris", () => {
    render(<BrandGradient inactive />);

    expect(mockGradient).toHaveBeenCalledWith(
      expect.objectContaining({ colors: darkTheme.gradients.disabled, start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }),
    );
  });

  it("deja pasar el estilo", () => {
    render(<BrandGradient style={{ flex: 1 }} />);

    expect(mockGradient).toHaveBeenCalledWith(expect.objectContaining({ style: { flex: 1 } }));
  });
});
