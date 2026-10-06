import { fireEvent, render, screen } from "@testing-library/react-native";

import { PersonalDataCard } from "@/features/profile/components/PersonalDataCard";
import { useProfileEditorStore } from "@/features/profile/store/profileEditorStore";

import { teacherProfile } from "../../../helpers/profileFactories";

describe("PersonalDataCard", () => {
  it("sus datos personales bajo su título", () => {
    render(<PersonalDataCard profile={teacherProfile()} />);

    expect(screen.getByRole("header", { name: "Datos personales" })).toBeTruthy();
    expect(screen.getByText("david@playtopia.com")).toBeTruthy();
    expect(screen.getByText("+34600123456")).toBeTruthy();
    expect(screen.getByText("15/05/1990")).toBeTruthy();
    expect(screen.getByText("Masculino")).toBeTruthy();
  });

  it("«Editar» abre su editor en el panel de Perfil", () => {
    useProfileEditorStore.getState().close();
    render(<PersonalDataCard profile={teacherProfile()} />);

    fireEvent.press(screen.getByRole("button", { name: "Editar datos personales" }));

    expect(useProfileEditorStore.getState().section).toBe("personal");
  });
});
