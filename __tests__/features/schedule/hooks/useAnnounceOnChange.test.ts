import { renderHook } from "@testing-library/react-native";
import { AccessibilityInfo } from "react-native";

import { useAnnounceOnChange } from "@/features/schedule/hooks/useAnnounceOnChange";

describe("useAnnounceOnChange", () => {
  it("no dice nada al montar; cada cambio, sí", () => {
    const announce = jest.spyOn(AccessibilityInfo, "announceForAccessibility").mockImplementation(() => undefined);
    const { rerender } = renderHook(({ message }) => useAnnounceOnChange(message), {
      initialProps: { message: "Hoy · lunes 5" },
    });
    expect(announce).not.toHaveBeenCalled();

    rerender({ message: "martes 6" });
    expect(announce).toHaveBeenCalledWith("martes 6");

    rerender({ message: "martes 6" });
    expect(announce).toHaveBeenCalledTimes(1);
    announce.mockRestore();
  });
});
