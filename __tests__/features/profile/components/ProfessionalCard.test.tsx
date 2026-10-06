import { render, screen } from "@testing-library/react-native";

import { ProfessionalCard } from "@/features/profile/components/ProfessionalCard";

import { teacherProfile } from "../../../helpers/profileFactories";

describe("ProfessionalCard", () => {
  it("su presentación y sus especialidades", () => {
    render(<ProfessionalCard profile={teacherProfile()} />);

    expect(screen.getByRole("header", { name: "Perfil profesional" })).toBeTruthy();
    expect(screen.getByText("Entrenador de pádel especializado en cantera y competición.")).toBeTruthy();
    expect(screen.getByText("Técnica")).toBeTruthy();
    expect(screen.getByText("Táctica")).toBeTruthy();
  });

  it("sin presentación ni deportes, dice que aún no lo ha completado", () => {
    render(<ProfessionalCard profile={teacherProfile({ description: null, sports: [] })} />);

    expect(screen.getByText("Aún no lo has completado")).toBeTruthy();
  });

  it("una presentación en blanco no deja un hueco", () => {
    render(<ProfessionalCard profile={teacherProfile({ description: "  " })} />);

    expect(screen.queryByText("Aún no lo has completado")).toBeNull();
    expect(screen.getByText("Técnica")).toBeTruthy();
  });
});
