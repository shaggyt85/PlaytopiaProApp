import { screen } from "@testing-library/react-native";

import { ProfileHeader } from "@/features/profile/components/ProfileHeader";

import { teacherProfile } from "../../../helpers/profileFactories";
import { renderWithProviders } from "../../../helpers/renderWithProviders";

jest.mock("expo-image", () => ({ Image: () => null }));
jest.mock("@/features/profile/services/photoPicker", () => ({ photoPicker: { pick: jest.fn() } }));

describe("ProfileHeader", () => {
  it("su foto, que se puede cambiar, su nombre completo y su rol con los años de experiencia", () => {
    renderWithProviders(<ProfileHeader profile={teacherProfile()} />);

    expect(screen.getByRole("button", { name: "Cambiar foto" })).toBeTruthy();
    expect(screen.getByText("David Álvarez")).toBeTruthy();
    expect(screen.getByText("Entrenador · 6 años de experiencia")).toBeTruthy();
  });

  it("sin años de experiencia, solo el rol", () => {
    renderWithProviders(<ProfileHeader profile={teacherProfile({ experience_years: null })} />);

    expect(screen.getByText("Entrenador")).toBeTruthy();
  });
});
