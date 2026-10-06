import { render, screen } from "@testing-library/react-native";

import { PersonalDataCard } from "@/features/profile/components/PersonalDataCard";

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

  it("sin «Editar» hasta que llegue su editor", () => {
    render(<PersonalDataCard profile={teacherProfile()} />);

    expect(screen.queryByRole("button")).toBeNull();
  });
});
