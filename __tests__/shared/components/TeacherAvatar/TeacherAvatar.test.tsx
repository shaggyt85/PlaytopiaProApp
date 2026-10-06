import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { TeacherAvatar } from "@/shared/components/TeacherAvatar";
import { AVATAR_SIZES } from "@/shared/components/TeacherAvatar/TeacherAvatar.styles";
import { useReduceMotion } from "@/shared/hooks/useReduceMotion";

type ImageProps = { onError: () => void; transition: number; source: { uri: string } };

const mockImage = jest.fn();
jest.mock("expo-image", () => ({
  Image: (props: Record<string, unknown>) => {
    mockImage(props);
    return null;
  },
}));
jest.mock("@/shared/hooks/useReduceMotion", () => ({ useReduceMotion: jest.fn(() => false) }));

const URL = "https://img.test/avatars/teacher/42.jpg";
const lastImageProps = () => mockImage.mock.calls.at(-1)?.[0] as ImageProps;
const widthOf = () => StyleSheet.flatten(screen.getByTestId("teacher-avatar").props.style).width;

describe("TeacherAvatar", () => {
  beforeEach(() => jest.mocked(useReduceMotion).mockReturnValue(false));

  it("pinta la foto del perfil con un fundido corto", () => {
    render(<TeacherAvatar url={URL} />);

    expect(lastImageProps().source).toEqual({ uri: URL });
    expect(lastImageProps().transition).toBe(200);
  });

  it("con onPress es un botón (la Agenda lleva a Perfil)", () => {
    const onPress = jest.fn();
    render(<TeacherAvatar url={URL} onPress={onPress} accessibilityLabel="Mi perfil" />);

    fireEvent.press(screen.getByRole("button", { name: "Mi perfil" }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("sin onPress es solo la foto, con su nombre para el lector de pantalla", () => {
    render(<TeacherAvatar url={URL} accessibilityLabel="Tu foto de perfil" />);

    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getByRole("image", { name: "Tu foto de perfil" })).toBeTruthy();
  });

  it.each(["md", "xl"] as const)("el tamaño %s es el de AVATAR_SIZES", (size) => {
    render(<TeacherAvatar url={URL} size={size} />);

    expect(widthOf()).toBe(AVATAR_SIZES[size].side);
  });

  it("sin tamaño, el de la cabecera de la Agenda", () => {
    render(<TeacherAvatar url={URL} />);

    expect(widthOf()).toBe(AVATAR_SIZES.md.side);
  });

  it("mientras no hay perfil, el círculo vacío", () => {
    render(<TeacherAvatar url={undefined} />);

    expect(mockImage).not.toHaveBeenCalled();
    expect(screen.getByTestId("teacher-avatar")).toBeTruthy();
  });

  it("si la foto no carga, queda el círculo vacío; con otra URL se vuelve a intentar", () => {
    const { rerender } = render(<TeacherAvatar url={URL} />);

    const { onError } = lastImageProps();
    mockImage.mockClear();
    act(() => onError());
    expect(mockImage).not.toHaveBeenCalled();

    rerender(<TeacherAvatar url="https://img.test/avatars/teacher/42-nueva.jpg" />);
    expect(lastImageProps().source).toEqual({ uri: "https://img.test/avatars/teacher/42-nueva.jpg" });
  });

  it("con «reducir movimiento», la foto aparece sin fundido", () => {
    jest.mocked(useReduceMotion).mockReturnValue(true);
    render(<TeacherAvatar url={URL} />);

    expect(lastImageProps().transition).toBe(0);
  });

  it("ocupada: no se puede tocar y lo dice al lector de pantalla", () => {
    const onPress = jest.fn();
    render(<TeacherAvatar url={URL} onPress={onPress} busy accessibilityLabel="Cambiar foto" />);

    fireEvent.press(screen.getByRole("button", { name: "Cambiar foto" }));

    expect(onPress).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Cambiar foto" })).toBeBusy();
    expect(screen.getByRole("button", { name: "Cambiar foto" })).toBeDisabled();
  });
});
