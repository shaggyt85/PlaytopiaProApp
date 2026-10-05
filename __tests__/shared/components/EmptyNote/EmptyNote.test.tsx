import { render, screen } from "@testing-library/react-native";

import { EmptyNote } from "@/shared/components/EmptyNote";

describe("EmptyNote", () => {
  it("el aviso en su tarjeta", () => {
    render(<EmptyNote message="Aún no hay alumnos apuntados" testID="note" />);

    expect(screen.getByText("Aún no hay alumnos apuntados")).toBeTruthy();
    expect(screen.getByTestId("note")).toBeTruthy();
  });
});
