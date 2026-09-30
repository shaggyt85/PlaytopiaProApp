import { render, screen } from "@testing-library/react-native";

import { StudentRow } from "@/features/schedule/components/StudentRow";

describe("StudentRow", () => {
  it("el círculo con sus iniciales y su nombre; se lee como su nombre", () => {
    render(<StudentRow student={{ name: "Lucía", last_name: "Romero" }} index={0} />);

    expect(screen.getByLabelText("Lucía Romero")).toBeTruthy();
    expect(screen.getByText("LR", { includeHiddenElements: true })).toBeTruthy();
  });
});
