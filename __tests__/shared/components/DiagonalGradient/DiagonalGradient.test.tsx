import { render } from "@testing-library/react-native";

import { DiagonalGradient } from "@/shared/components/DiagonalGradient";

const mockGradient = jest.fn();
jest.mock("expo-linear-gradient", () => ({
  LinearGradient: (props: Record<string, unknown>) => {
    mockGradient(props);
    return null;
  },
}));

describe("DiagonalGradient", () => {
  it("pinta sus colores a 135°, de arriba a la izquierda a abajo a la derecha", () => {
    render(<DiagonalGradient colors={["#000", "#fff"]} style={{ flex: 1 }} />);

    expect(mockGradient).toHaveBeenCalledWith(
      expect.objectContaining({
        colors: ["#000", "#fff"],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
        style: { flex: 1 },
      }),
    );
  });

  it("a 160°, el del gradient-ink: más vertical que el de 135°", () => {
    render(<DiagonalGradient colors={["#000", "#fff"]} angle={160} />);

    const { start, end } = mockGradient.mock.calls.at(-1)[0];
    expect(end.y - start.y).toBeGreaterThan(end.x - start.x);
  });
});
