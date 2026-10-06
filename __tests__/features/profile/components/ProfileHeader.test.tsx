import { render, screen } from "@testing-library/react-native";

import { ProfileHeader } from "@/features/profile/components/ProfileHeader";

import { teacherProfile } from "../../../helpers/profileFactories";

jest.mock("expo-image", () => ({ Image: () => null }));

describe("ProfileHeader", () => {
  it("su foto, su nombre completo y su rol con los años de experiencia", () => {
    render(<ProfileHeader profile={teacherProfile()} />);

    expect(screen.getByRole("image", { name: "Tu foto de perfil" })).toBeTruthy();
    expect(screen.getByText("David Álvarez")).toBeTruthy();
    expect(screen.getByText("Entrenador · 6 años de experiencia")).toBeTruthy();
  });

  it("sin años de experiencia, solo el rol", () => {
    render(<ProfileHeader profile={teacherProfile({ experience_years: null })} />);

    expect(screen.getByText("Entrenador")).toBeTruthy();
  });

  it("la foto aún no se puede tocar", () => {
    render(<ProfileHeader profile={teacherProfile()} />);

    expect(screen.queryByRole("button")).toBeNull();
  });
});
