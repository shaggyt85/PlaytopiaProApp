import { QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";

import { useAppUpdate } from "@/features/app-update/hooks/useAppUpdate";
import { createQueryClient } from "@/shared/config/queryClient";

jest.mock("@/shared/config/appVersion", () => ({ APP_VERSION: "1.0.0" }));

const urls = { ios: "https://apps.apple.com/pro", android: "https://play.google.com/pro" };

function setup(check: jest.Mock) {
  const client = createQueryClient();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return renderHook(() => useAppUpdate({ check }), { wrapper });
}

describe("useAppUpdate", () => {
  it("pregunta con la tienda de este móvil y la versión instalada", async () => {
    const check = jest.fn().mockResolvedValue({ update_type: "soft", store_url: urls });

    const { result } = setup(check);

    await waitFor(() => expect(result.current.notice).toBe("soft"));
    expect(check).toHaveBeenCalledWith("ios", "1.0.0");
    expect(result.current.storeUrl).toBe(urls.ios);
  });

  it("mientras no responde, o si falla, ningún aviso", async () => {
    const check = jest.fn().mockRejectedValue(new Error("sin red"));

    const { result } = setup(check);

    expect(result.current).toEqual({ notice: "none", storeUrl: null });
    await waitFor(() => expect(check).toHaveBeenCalled());
    expect(result.current).toEqual({ notice: "none", storeUrl: null });
  });
});
