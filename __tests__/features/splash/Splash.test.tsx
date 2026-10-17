import { act, cleanup, render, screen } from "@testing-library/react-native";
import { useUpdates } from "expo-updates";

import { SPLASH_TIMING } from "@/features/splash/components/AnimatedSplash/AnimatedSplash.animation";
import { Splash } from "@/features/splash";

jest.mock("expo-updates", () => ({
  isEnabled: true,
  useUpdates: jest.fn(),
  reloadAsync: jest.fn().mockResolvedValue(undefined),
}));

type UpdatesState = ReturnType<typeof useUpdates>;

const setUpdates = (state: Partial<UpdatesState>) =>
  jest.mocked(useUpdates).mockReturnValue({
    isStartupProcedureRunning: false,
    isChecking: false,
    isDownloading: false,
    isUpdatePending: false,
    isRestarting: false,
    ...state,
  } as UpdatesState);

const afterSplash = () =>
  act(() => {
    jest.advanceTimersByTime(SPLASH_TIMING.duration + SPLASH_TIMING.fadeOut + 100);
  });

describe("Splash", () => {
  beforeEach(() => jest.useFakeTimers());

  afterEach(() => {
    cleanup();
    jest.useRealTimers();
  });

  it("sin actualización, se va como siempre y sin tarjeta", () => {
    setUpdates({});
    const onFinish = jest.fn();
    render(<Splash onFinish={onFinish} />);

    expect(screen.queryByTestId("ota-progress-card")).toBeNull();
    afterSplash();
    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  it("con una actualización bajando, enseña su progreso y no se va", () => {
    setUpdates({ isDownloading: true, downloadProgress: 0.42 });
    const onFinish = jest.fn();
    render(<Splash onFinish={onFinish} />);

    expect(screen.getByText("42 %")).toBeTruthy();
    afterSplash();
    expect(onFinish).not.toHaveBeenCalled();
  });
});
