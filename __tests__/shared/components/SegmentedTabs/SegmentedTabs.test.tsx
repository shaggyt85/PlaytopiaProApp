import { IconLoMapPin } from "@playtopia/icons/react-native";
import { fireEvent, render, screen } from "@testing-library/react-native";

import { SegmentedTabs, type SegmentedTabOption } from "@/shared/components/SegmentedTabs";

const mockGradient = jest.fn();
jest.mock("expo-linear-gradient", () => ({
  LinearGradient: (props: Record<string, unknown>) => {
    mockGradient(props);
    return null;
  },
}));

const options: SegmentedTabOption<"a" | "b">[] = [
  { key: "a", label: "Primera", Icon: IconLoMapPin },
  { key: "b", label: "Segunda" },
];

describe("SegmentedTabs", () => {
  it("pinta una pestaña por opción, con la elegida marcada", () => {
    render(<SegmentedTabs options={options} value="a" onChange={jest.fn()} />);

    expect(screen.getAllByRole("tab")).toHaveLength(2);
    expect(screen.getByRole("tab", { name: "Primera" }).props.accessibilityState).toEqual({ selected: true });
    expect(screen.getByRole("tab", { name: "Segunda" }).props.accessibilityState).toEqual({ selected: false });
  });

  it("al pulsar otra pestaña avisa con su clave", () => {
    const onChange = jest.fn();
    render(<SegmentedTabs options={options} value="a" onChange={onChange} />);

    fireEvent.press(screen.getByRole("tab", { name: "Segunda" }));

    expect(onChange).toHaveBeenCalledWith("b");
  });

  it("pulsar la que ya está elegida no avisa", () => {
    const onChange = jest.fn();
    render(<SegmentedTabs options={options} value="a" onChange={onChange} />);

    fireEvent.press(screen.getByRole("tab", { name: "Primera" }));

    expect(onChange).not.toHaveBeenCalled();
  });

  it("cada pestaña lleva su testID a partir del del selector", () => {
    render(<SegmentedTabs options={options} value="b" onChange={jest.fn()} testID="tabs" />);

    expect(screen.getByTestId("tabs-a")).toBeTruthy();
    expect(screen.getByTestId("tabs-b")).toBeTruthy();
  });
});

describe("SegmentedTabs underline", () => {
  it("se comporta igual, a la altura del área táctil mínima", () => {
    const onChange = jest.fn();
    render(<SegmentedTabs options={options} value="a" onChange={onChange} variant="underline" />);

    const second = screen.getByRole("tab", { name: "Segunda" });
    fireEvent.press(second);

    expect(onChange).toHaveBeenCalledWith("b");
    expect(second).toHaveStyle({ minHeight: 44 });
  });

  it("la activa lleva la raya del degradado de marca debajo, no de fondo", () => {
    render(<SegmentedTabs options={options} value="a" onChange={jest.fn()} variant="underline" />);

    expect(mockGradient).toHaveBeenCalledTimes(1);
    expect(mockGradient.mock.calls[0][0].style).toMatchObject({ position: "absolute", height: 2 });
  });
});
