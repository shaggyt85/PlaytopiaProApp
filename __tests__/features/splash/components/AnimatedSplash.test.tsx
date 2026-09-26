import { act, cleanup, render, screen } from "@testing-library/react-native";

import { AnimatedSplash } from "@/features/splash";

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
});
