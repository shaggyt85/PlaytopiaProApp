import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import { getAnimatedStyle } from "react-native-reanimated";

import { TabBar } from "@/shared/components/TabBar";
import { useReduceMotion } from "@/shared/hooks/useReduceMotion";

let mockPathname = "/";
jest.mock("expo-router", () => ({ usePathname: () => mockPathname }));
jest.mock("@/shared/hooks/useReduceMotion", () => ({ useReduceMotion: jest.fn(() => false) }));

/** Simula que la barra se ha pintado con ese ancho útil (3 pestañas de 70). */
const layout = (width = 210) =>
  fireEvent(screen.getByTestId("tab-bar-track"), "layout", {
    nativeEvent: { layout: { width, height: 52, x: 0, y: 0 } },
  });

/** Posición y escala actuales de la gota. */
const dropTransform = () => {
  const [{ translateX }, { scale }] = getAnimatedStyle(screen.getByTestId("tab-indicator")).transform as [
    { translateX: number },
    { scale: number },
  ];
  return { translateX, scale };
};

/** Deja correr las animaciones (fotogramas de Reanimated en Jest). */
const runAnimations = (ms = 2000) => act(() => jest.advanceTimersByTime(ms));

describe("TabBar", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockPathname = "/";
    jest.mocked(useReduceMotion).mockReturnValue(false);
  });
  afterEach(() => jest.useRealTimers());

  it("es una lista de pestañas y pinta los botones que recibe", () => {
    render(
      <TabBar>
        <Text>Agenda</Text>
      </TabBar>,
    );

    expect(screen.getByTestId("tab-bar")).toHaveProp("accessibilityRole", "tablist");
    expect(screen.getByText("Agenda")).toBeTruthy();
  });

  it("la gota aparece al conocer el ancho, bajo la pestaña de la ruta", () => {
    mockPathname = "/groups";
    render(<TabBar />);
    expect(screen.queryByTestId("tab-indicator")).toBeNull();

    layout();
    runAnimations();

    expect(screen.getByTestId("tab-indicator")).toHaveAnimatedStyle({
      transform: [{ translateX: 70 }, { scale: 1 }],
    });
  });

  it("al cambiar de pestaña la gota salta hasta la nueva", () => {
    const { rerender } = render(<TabBar />);
    layout();
    runAnimations();

    mockPathname = "/profile";
    rerender(<TabBar />);
    runAnimations();

    // El muelle llega a su reposo de forma asintótica: la escala, casi 1.
    const { translateX, scale } = dropTransform();
    expect(translateX).toBeCloseTo(140, 1);
    expect(scale).toBeCloseTo(1, 3);
  });

  it("con «reducir movimiento» la gota va directa, sin animación", () => {
    jest.mocked(useReduceMotion).mockReturnValue(true);
    const { rerender } = render(<TabBar />);
    layout();

    mockPathname = "/groups";
    rerender(<TabBar />);
    runAnimations(16); // un solo fotograma: sin animación ya está en su sitio

    expect(screen.getByTestId("tab-indicator")).toHaveAnimatedStyle({
      transform: [{ translateX: 70 }, { scale: 1 }],
    });
  });

  it("en una ruta que no es de ninguna pestaña no pinta la gota", () => {
    mockPathname = "/sign-in";
    render(<TabBar />);

    layout();

    expect(screen.queryByTestId("tab-indicator")).toBeNull();
  });
});
