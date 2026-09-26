import * as Haptics from "expo-haptics";

import { selectionFeedback } from "@/shared/utils/haptics";

jest.mock("expo-haptics", () => ({ selectionAsync: jest.fn() }));

describe("selectionFeedback", () => {
  it("pide la vibración de selección", () => {
    jest.mocked(Haptics.selectionAsync).mockResolvedValue();

    selectionFeedback();

    expect(Haptics.selectionAsync).toHaveBeenCalled();
  });

  it("si el móvil no puede vibrar no rompe nada", async () => {
    jest.mocked(Haptics.selectionAsync).mockRejectedValue(new Error("sin motor de vibración"));

    expect(() => selectionFeedback()).not.toThrow();
    await Promise.resolve();
  });
});
