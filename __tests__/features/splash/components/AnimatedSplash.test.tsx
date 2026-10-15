import { act, cleanup, fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { AnimatedSplash } from "@/features/splash/components/AnimatedSplash";
import { SPLASH_TIMING } from "@/features/splash/components/AnimatedSplash/AnimatedSplash";

describe("AnimatedSplash", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    // Desmontar antes de volver a los timers reales: si no, los de la
    // animación saltan cuando el entorno de test ya no existe.
    cleanup();
    jest.useRealTimers();
  });

  it("muestra la marca y el lema traducido", () => {
    render(<AnimatedSplash onFinish={jest.fn()} />);

    expect(screen.getByText("PLAYTOPIA")).toBeTruthy();
    expect(screen.getByTestId("animated-splash")).toBeTruthy();
  });

  it("avisa con onFinish cuando termina la animación", () => {
    const onFinish = jest.fn();
    render(<AnimatedSplash onFinish={onFinish} duration={3000} />);

    expect(onFinish).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(3000 + 400 + 100);
    });

    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  it("es opaco desde el primer frame (no deja ver la pantalla de debajo)", () => {
    render(<AnimatedSplash onFinish={jest.fn()} />);

    expect(screen.getByTestId("animated-splash")).toHaveStyle({ opacity: 1 });
  });

  it("avisa con onReady cuando ya está pintado, para ocultar el splash nativo", () => {
    const onReady = jest.fn();
    render(<AnimatedSplash onReady={onReady} onFinish={jest.fn()} />);

    fireEvent(screen.getByTestId("animated-splash"), "layout", {
      nativeEvent: { layout: { x: 0, y: 0, width: 390, height: 844 } },
    });

    expect(onReady).toHaveBeenCalledTimes(1);
  });

  it("el título cabe en la duración: se ve completo al menos medio segundo", () => {
    const { fall, bounces, pauseBeforeText, textFadeIn, duration } = SPLASH_TIMING;
    const textStarts =
      fall + bounces.reduce((total, [, subida]) => total + 2 * subida, 0) + pauseBeforeText;
    const textFullyVisible = textStarts + textFadeIn;

    expect(duration - textFullyVisible).toBeGreaterThanOrEqual(500);
  });

  it("con hold no se va al cumplirse la duración, y se va en cuanto se suelta", () => {
    const onFinish = jest.fn();
    const { rerender } = render(<AnimatedSplash onFinish={onFinish} duration={3000} hold />);

    act(() => {
      jest.advanceTimersByTime(3000 + 400 + 100);
    });
    expect(onFinish).not.toHaveBeenCalled();

    rerender(<AnimatedSplash onFinish={onFinish} duration={3000} hold={false} />);
    act(() => {
      jest.advanceTimersByTime(400 + 100);
    });
    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  it("pinta abajo lo que recibe (la tarjeta de la actualización)", () => {
    render(
      <AnimatedSplash onFinish={jest.fn()}>
        <Text>Actualizando</Text>
      </AnimatedSplash>,
    );

    expect(screen.getByText("Actualizando")).toBeTruthy();
  });
});
