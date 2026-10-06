import { fireEvent, render, screen } from "@testing-library/react-native";

import { DeleteAccountButton } from "@/features/profile/components/DeleteAccountButton";
import { useProfileEditorStore } from "@/features/profile/store/profileEditorStore";

describe("DeleteAccountButton", () => {
  it("abre la baja en el panel de Perfil", () => {
    useProfileEditorStore.getState().close();
    render(<DeleteAccountButton />);

    fireEvent.press(screen.getByRole("button", { name: "Borrar cuenta" }));

    expect(useProfileEditorStore.getState().section).toBe("deleteAccount");
  });
});
