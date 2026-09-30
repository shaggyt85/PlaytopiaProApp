import { render, screen } from "@testing-library/react-native";

import { ClubCard } from "@/features/schedule/components/ClubCard";
import { darkTheme } from "@/shared/config/theme";

const club = { label: "Wave Padel Club", colors: darkTheme.clubColors[2] };

describe("ClubCard", () => {
  it("el nombre del club y la calle; se lee de una vez", () => {
    render(<ClubCard club={club} card={{ address: "Pº de la Castellana 300" }} />);

    expect(screen.getByLabelText("Club: Wave Padel Club, Pº de la Castellana 300")).toBeTruthy();
    expect(screen.getByText("Wave Padel Club", { includeHiddenElements: true })).toBeTruthy();
    expect(screen.getByText("Pº de la Castellana 300", { includeHiddenElements: true })).toBeTruthy();
    // El emoji del club del prototipo: su punto, grande.
    expect(screen.getByTestId("club-dot", { includeHiddenElements: true })).toBeTruthy();
  });

  it("sin dirección, solo el nombre y sin coma sobrante", () => {
    render(<ClubCard club={club} card={{ address: "  " }} />);

    expect(screen.getByLabelText("Club: Wave Padel Club")).toBeTruthy();
  });
});
