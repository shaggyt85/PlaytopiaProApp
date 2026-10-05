import { render } from "@testing-library/react-native";

import { Chevron } from "@/shared/components/Chevron";
import { darkTheme } from "@/shared/config/theme";
import { withAlpha } from "@/shared/utils/color";

const mockIcon = jest.fn();
jest.mock("@playtopia/icons/react-native", () => ({
  IconLoChevronRight: (props: Record<string, unknown>) => {
    mockIcon(props);
    return null;
  },
}));

const lastProps = () => mockIcon.mock.calls.at(-1)?.[0];

describe("Chevron", () => {
  it("por defecto, la de filas y paneles: 16 y en el gris del texto secundario", () => {
    render(<Chevron />);

    expect(lastProps()).toEqual({ size: 16, color: darkTheme.colors.textSecondary });
  });

  it("la de las tarjetas grandes, de 20, y más apagada sobre un fondo de color", () => {
    render(<Chevron size="md" alpha={0.7} />);

    expect(lastProps()).toEqual({ size: 20, color: withAlpha(darkTheme.colors.textSecondary, 0.7) });
  });
});
