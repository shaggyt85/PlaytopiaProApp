import { fireEvent, render, screen } from "@testing-library/react-native";

import { EditButton } from "@/features/profile/components/EditButton";
import { useProfileEditorStore } from "@/features/profile/store/profileEditorStore";

describe("EditButton", () => {
  beforeEach(() => useProfileEditorStore.getState().close());

  it.each([
    ["personal", "Editar datos personales"],
    ["professional", "Editar perfil profesional"],
  ] as const)("«Editar» abre su sección (%s) y dice cuál al lector de pantalla", (section, label) => {
    render(<EditButton section={section} />);

    fireEvent.press(screen.getByRole("button", { name: label }));

    expect(screen.getByText("Editar")).toBeTruthy();
    expect(useProfileEditorStore.getState().section).toBe(section);
  });
});
