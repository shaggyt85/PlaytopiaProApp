import { focusManager, onlineManager } from "@tanstack/react-query";
import { addNetworkStateListener } from "expo-network";
import { AppState } from "react-native";

import { setupQueryManagers } from "@/shared/config/queryManagers";

jest.mock("expo-network", () => ({
  addNetworkStateListener: jest.fn(() => ({ remove: jest.fn() })),
}));

describe("setupQueryManagers", () => {
  let appStateListener: (status: string) => void;
  const removeAppState = jest.fn();

  beforeEach(() => {
    jest
      .spyOn(AppState, "addEventListener")
      .mockImplementation((_event, listener) => {
        appStateListener = listener as (status: string) => void;
        return { remove: removeAppState };
      });
  });

  afterEach(() => jest.restoreAllMocks());

  it("la app en primer plano cuenta como foco para TanStack", () => {
    const cleanup = setupQueryManagers();

    appStateListener("background");
    expect(focusManager.isFocused()).toBe(false);
    appStateListener("active");
    expect(focusManager.isFocused()).toBe(true);

    cleanup();
    expect(removeAppState).toHaveBeenCalled();
  });

  it("solo se considera sin red cuando isConnected es false", () => {
    const cleanup = setupQueryManagers();
    const networkListener = jest.mocked(addNetworkStateListener).mock.calls.at(-1)?.[0];

    networkListener?.({ isConnected: false } as never);
    expect(onlineManager.isOnline()).toBe(false);
    networkListener?.({ isConnected: undefined } as never);
    expect(onlineManager.isOnline()).toBe(true);

    cleanup();
  });
});
