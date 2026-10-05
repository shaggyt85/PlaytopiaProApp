import { renderHook } from "@testing-library/react-native";
import { useRouter } from "expo-router";

import { useGoBack } from "@/shared/hooks/useGoBack";

jest.mock("expo-router", () => ({ useRouter: jest.fn() }));

const router = { back: jest.fn(), replace: jest.fn(), canGoBack: jest.fn(() => true) };

describe("useGoBack", () => {
  beforeEach(() => jest.mocked(useRouter).mockReturnValue(router as never));

  it("vuelve a donde se vino", () => {
    renderHook(() => useGoBack()).result.current();

    expect(router.back).toHaveBeenCalled();
  });

  it("si no hay a dónde volver (se abrió desde un aviso), lleva a la Agenda", () => {
    router.canGoBack.mockReturnValueOnce(false);

    renderHook(() => useGoBack()).result.current();

    expect(router.replace).toHaveBeenCalledWith("/");
  });
});
