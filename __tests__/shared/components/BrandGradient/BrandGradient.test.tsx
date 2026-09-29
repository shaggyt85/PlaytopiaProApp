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

// El ángulo lo pone `DiagonalGradient` (su test); aquí, los colores.
describe("BrandGradient", () => {
  it("pinta el degradado de marca", () => {
    render(<BrandGradient />);

    expect(mockGradient).toHaveBeenCalledWith(expect.objectContaining({ colors: darkTheme.gradients.brand }));
  });

  it("apagado, en gris", () => {
    render(<BrandGradient inactive />);

    expect(mockGradient).toHaveBeenCalledWith(expect.objectContaining({ colors: darkTheme.gradients.disabled }));
  });

  it("deja pasar el estilo", () => {
    render(<BrandGradient style={{ flex: 1 }} />);

    expect(mockGradient).toHaveBeenCalledWith(expect.objectContaining({ style: { flex: 1 } }));
  });
});
