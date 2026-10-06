import { fireEvent, render, screen } from "@testing-library/react-native";

import { SpecialtyPicker } from "@/features/profile/components/SpecialtyPicker";

const CATALOG = [
  {
    code: "padel",
    name: "Pádel",
    specialties: [
      { code: "technique", name: "Técnica" },
      { code: "tactics", name: "Táctica" },
      { code: "competition", name: "Competición" },
    ],
  },
  { code: "tennis", name: "Tenis", specialties: [] },
];

describe("SpecialtyPicker", () => {
  it("cada deporte con sus especialidades; las elegidas, marcadas", () => {
    render(<SpecialtyPicker catalog={CATALOG} value={[{ code: "padel", specialties: ["technique"] }]} onChange={jest.fn()} />);

    expect(screen.getByText("Pádel")).toBeTruthy();
    expect(screen.getByRole("checkbox", { name: "Técnica", checked: true })).toBeTruthy();
    expect(screen.getByRole("checkbox", { name: "Táctica", checked: false })).toBeTruthy();
  });

  it("tocar una la elige", () => {
    const onChange = jest.fn();
    render(<SpecialtyPicker catalog={CATALOG} value={[]} onChange={onChange} />);

    fireEvent.press(screen.getByRole("checkbox", { name: "Competición" }));

    expect(onChange).toHaveBeenCalledWith([{ code: "padel", specialties: ["competition"] }]);
  });

  it("un deporte sin especialidades se elige con su propio chip", () => {
    const onChange = jest.fn();
    render(<SpecialtyPicker catalog={CATALOG} value={[]} onChange={onChange} />);

    fireEvent.press(screen.getByRole("checkbox", { name: "Tenis" }));

    expect(onChange).toHaveBeenCalledWith([{ code: "tennis", specialties: [] }]);
  });
});
