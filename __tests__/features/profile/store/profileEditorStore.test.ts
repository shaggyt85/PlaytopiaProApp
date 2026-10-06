import { useProfileEditorStore } from "@/features/profile/store/profileEditorStore";

describe("useProfileEditorStore", () => {
  beforeEach(() => useProfileEditorStore.getState().close());

  it("empieza sin ningún editor abierto", () => {
    expect(useProfileEditorStore.getState().section).toBeNull();
  });

  it("abre la sección que se le pide y la cierra", () => {
    useProfileEditorStore.getState().open("personal");
    expect(useProfileEditorStore.getState().section).toBe("personal");

    useProfileEditorStore.getState().close();
    expect(useProfileEditorStore.getState().section).toBeNull();
  });
});
