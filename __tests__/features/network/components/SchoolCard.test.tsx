import { act, render, screen } from "@testing-library/react-native";

import { SchoolCard } from "@/features/network/components/SchoolCard";
import type { SchoolCard as SchoolCardData } from "@/features/network/schemas/network.schema";
import { useReduceMotion } from "@/shared/hooks/useReduceMotion";

type ImageProps = { onError: () => void; transition: number; recyclingKey: string; source: { uri: string } };

const mockImage = jest.fn();
jest.mock("expo-image", () => ({
  Image: (props: Record<string, unknown>) => {
    mockImage(props);
    return null;
  },
}));
jest.mock("@/shared/hooks/useReduceMotion", () => ({ useReduceMotion: jest.fn(() => false) }));

const card: SchoolCardData = {
  db_id: 3,
  club_id: 7,
  name: "Escuela Norte",
  club_name: "Sede Centro",
  city: "Madrid",
  address: "Calle Mayor 1",
  background_url: "https://img.test/norte.jpg",
};

const lastImageProps = () => mockImage.mock.calls.at(-1)?.[0] as ImageProps;

describe("SchoolCard", () => {
  beforeEach(() => {
    jest.mocked(useReduceMotion).mockReturnValue(false);
  });

  it("muestra la sede, la escuela y su ubicación, y se lee como un solo bloque", () => {
    render(<SchoolCard card={card} />);

    expect(screen.getByText("Sede Centro")).toBeTruthy();
    expect(screen.getByText("Escuela Norte")).toBeTruthy();
    expect(screen.getByText("Madrid · Calle Mayor 1")).toBeTruthy();
    expect(screen.getByLabelText("Escuela Norte, Sede Centro, Madrid · Calle Mayor 1")).toBeTruthy();
  });

  it("sin sede no pone el chip, y sin ubicación no pone la línea de datos", () => {
    render(<SchoolCard card={{ ...card, club_name: null, city: "", address: "" }} />);

    expect(screen.queryByText("Sede Centro")).toBeNull();
    expect(screen.getByLabelText("Escuela Norte")).toBeTruthy();
  });

  it("pinta la portada con caché, con la clave de la sede para el reciclado", () => {
    render(<SchoolCard card={card} />);

    expect(lastImageProps()).toEqual(
      expect.objectContaining({
        source: { uri: card.background_url },
        cachePolicy: "memory-disk",
        recyclingKey: "3-7",
      }),
    );
    expect(lastImageProps().transition).toBeGreaterThan(0);
  });

  it("con «reducir movimiento» la portada aparece sin fundido", () => {
    jest.mocked(useReduceMotion).mockReturnValue(true);

    render(<SchoolCard card={card} />);

    expect(lastImageProps().transition).toBe(0);
  });

  it("si la portada no carga, la quita y deja el fondo del tema", () => {
    render(<SchoolCard card={card} testID="card" />);
    expect(screen.getByTestId("card")).toBeTruthy();

    const { onError } = lastImageOf(card.background_url);
    mockImage.mockClear();
    act(() => onError());

    expect(mockImage).not.toHaveBeenCalled();
    expect(screen.getByText("Escuela Norte")).toBeTruthy();
  });

  it("una fila reciclada para otra sede vuelve a intentar su portada", () => {
    const { rerender } = render(<SchoolCard card={card} />);
    act(() => lastImageOf(card.background_url).onError());

    mockImage.mockClear();
    rerender(<SchoolCard card={{ ...card, club_id: 8, background_url: "https://img.test/otra.jpg" }} />);

    expect(lastImageProps().source).toEqual({ uri: "https://img.test/otra.jpg" });
  });
});

/** Las props de la última portada pintada con esa URL. */
function lastImageOf(uri: string): ImageProps {
  const calls = mockImage.mock.calls.map(([props]) => props as ImageProps);
  const match = calls.filter((props) => props.source.uri === uri).at(-1);
  if (!match) throw new Error(`No se pintó la portada ${uri}`);
  return match;
}
