import { render, screen } from "@testing-library/react-native";

import { ExpandChevron } from "@/features/profile/components/ExpandChevron";
import { EXPAND_ANIMATION } from "@/features/profile/components/ExpandChevron/ExpandChevron.animation";
import { useReduceMotion } from "@/shared/hooks/useReduceMotion";

jest.mock("@/shared/hooks/useReduceMotion", () => ({ useReduceMotion: jest.fn(() => false) }));

const rotated = (deg: number) => ({ transform: [{ rotate: `${deg}deg` }] });

describe("ExpandChevron", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.mocked(useReduceMotion).mockReturnValue(false);
  });
  afterEach(() => jest.useRealTimers());

  it("cerrado mira a la derecha", () => {
    render(<ExpandChevron expanded={false} />);

    expect(screen.getByTestId("expand-chevron")).toHaveAnimatedStyle(rotated(0));
  });

  it("al abrir gira un cuarto de vuelta, con su animación", () => {
    const { rerender } = render(<ExpandChevron expanded={false} />);

    rerender(<ExpandChevron expanded />);
    jest.advanceTimersByTime(EXPAND_ANIMATION.durationMs);

    expect(screen.getByTestId("expand-chevron")).toHaveAnimatedStyle(rotated(EXPAND_ANIMATION.openDeg));
  });

  it("con «reducir movimiento», cambia sin girar", () => {
    jest.mocked(useReduceMotion).mockReturnValue(true);
    const { rerender } = render(<ExpandChevron expanded={false} />);

    rerender(<ExpandChevron expanded />);
    // Un fotograma, nada de la duración del giro.
    jest.advanceTimersByTime(16);

    expect(screen.getByTestId("expand-chevron")).toHaveAnimatedStyle(rotated(EXPAND_ANIMATION.openDeg));
  });
});
