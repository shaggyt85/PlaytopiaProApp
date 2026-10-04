import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { useRouter } from "expo-router";

import { TeacherAvatar } from "@/features/schedule/components/TeacherAvatar";
import { useReduceMotion } from "@/shared/hooks/useReduceMotion";

type ImageProps = { onError: () => void; transition: number; source: { uri: string } };

const mockImage = jest.fn();
jest.mock("expo-image", () => ({
  Image: (props: Record<string, unknown>) => {
    mockImage(props);
    return null;
  },
}));
jest.mock("expo-router", () => ({ useRouter: jest.fn() }));
jest.mock("@/shared/hooks/useReduceMotion", () => ({ useReduceMotion: jest.fn(() => false) }));

const URL = "https://img.test/avatars/teacher/42.jpg";
const lastImageProps = () => mockImage.mock.calls.at(-1)?.[0] as ImageProps;

describe("TeacherAvatar", () => {
  beforeEach(() => {
    jest.mocked(useRouter).mockReturnValue({ navigate: jest.fn() } as never);
    jest.mocked(useReduceMotion).mockReturnValue(false);
  });

  it("pinta la foto del perfil con un fundido corto", () => {
    render(<TeacherAvatar url={URL} />);

    expect(lastImageProps().source).toEqual({ uri: URL });
    expect(lastImageProps().transition).toBe(200);
  });

  it("al tocarlo lleva a Perfil", () => {
    const navigate = jest.fn();
    jest.mocked(useRouter).mockReturnValue({ navigate } as never);
    render(<TeacherAvatar url={URL} />);

    fireEvent.press(screen.getByRole("button", { name: "Mi perfil" }));

    expect(navigate).toHaveBeenCalledWith("/profile");
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
});
