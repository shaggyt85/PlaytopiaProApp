import { render, screen } from "@testing-library/react-native";

import { ClubBadge } from "@/features/schedule/components/ClubBadge";
import { darkTheme } from "@/shared/config/theme";

const mockGradient = jest.fn();
jest.mock("expo-linear-gradient", () => ({
  LinearGradient: (props: Record<string, unknown>) => {
    mockGradient(props);
    return null;
  },
}));

const club = { label: "Wave Padel Club", colors: darkTheme.clubColors[2] };

describe("ClubBadge", () => {
  it("el nombre del club sobre su degradado, con su punto", () => {
    render(<ClubBadge club={club} size="legend" />);

    expect(screen.getByText("Wave Padel Club")).toBeTruthy();
    expect(screen.getByTestId("club-dot")).toBeTruthy();
    expect(mockGradient).toHaveBeenCalledWith(expect.objectContaining({ colors: club.colors.gradient }));
  });

  it("en pequeño, para las filas", () => {
    render(<ClubBadge club={club} size="mini" />);

    expect(screen.getByText("Wave Padel Club")).toBeTruthy();
  });

  it("una sede sin nombre (ya no está en «Mis clubes») no sale", () => {
    render(<ClubBadge club={{ label: "", colors: darkTheme.clubColorUnknown }} size="mini" />);

    expect(screen.queryByTestId("club-badge")).toBeNull();
  });
});
