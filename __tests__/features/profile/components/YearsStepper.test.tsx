import { fireEvent, render, screen } from "@testing-library/react-native";

import { YearsStepper } from "@/features/profile/components/YearsStepper";
import { EXPERIENCE_YEARS_MAX } from "@/features/profile/schemas/professional.schema";

describe("YearsStepper", () => {
  it("un año más y uno menos", () => {
    const onChange = jest.fn();
    render(<YearsStepper value={6} onChange={onChange} />);

    fireEvent.press(screen.getByRole("button", { name: "Un año más" }));
    fireEvent.press(screen.getByRole("button", { name: "Un año menos" }));

    expect(onChange.mock.calls).toEqual([[7], [5]]);
    expect(screen.getByTestId("years-value")).toHaveTextContent("6");
  });

  it("no baja de 0 ni pasa del tope", () => {
    const { rerender } = render(<YearsStepper value={0} onChange={jest.fn()} />);
    expect(screen.getByRole("button", { name: "Un año menos" })).toBeDisabled();

    rerender(<YearsStepper value={EXPERIENCE_YEARS_MAX} onChange={jest.fn()} />);
    expect(screen.getByRole("button", { name: "Un año más" })).toBeDisabled();
  });

  it("sin decir: «—», y «+» empieza en 1", () => {
    const onChange = jest.fn();
    render(<YearsStepper value={null} onChange={onChange} />);

    expect(screen.getByTestId("years-value")).toHaveTextContent("—");
    expect(screen.getByRole("button", { name: "Un año menos" })).toBeDisabled();
    fireEvent.press(screen.getByRole("button", { name: "Un año más" }));
    expect(onChange).toHaveBeenCalledWith(1);
  });
});
