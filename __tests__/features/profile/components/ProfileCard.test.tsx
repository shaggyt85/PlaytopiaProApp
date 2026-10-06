import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { ProfileCard } from "@/features/profile/components/ProfileCard";

describe("ProfileCard", () => {
  it("su título como cabecera, el icono y su contenido", () => {
    const Icon = jest.fn(() => null);
    render(
      <ProfileCard Icon={Icon} title="Datos personales">
        <Text>david@playtopia.com</Text>
      </ProfileCard>,
    );

    expect(screen.getByRole("header", { name: "Datos personales" })).toBeTruthy();
    expect(screen.getByText("david@playtopia.com")).toBeTruthy();
    expect(Icon).toHaveBeenCalled();
  });
});
