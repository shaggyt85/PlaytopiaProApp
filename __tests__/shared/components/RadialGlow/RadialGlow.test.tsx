import { render } from "@testing-library/react-native";

import { RadialGlow } from "@/shared/components/RadialGlow";

const mockGradient = jest.fn();
jest.mock("react-native-svg", () => {
  const Pass = ({ children }: { children?: unknown }) => children ?? null;
  return {
    __esModule: true,
    default: Pass,
    Defs: Pass,
    Rect: () => null,
    Stop: () => null,
    RadialGradient: (props: Record<string, unknown>) => {
      mockGradient(props);
      return null;
    },
  };
});

describe("RadialGlow", () => {
  it("un degradado radial por resplandor, en su centro y con su radio", () => {
    render(
      <RadialGlow
        width={300}
        height={200}
        glows={[
          { color: "#EF1EC1", opacity: 0.3, cx: 340, cy: 40, r: 150, reach: 1 },
          { color: "#A63DF8", opacity: 0.2, cx: 0, cy: 0, r: 100, reach: 0.5 },
        ]}
      />,
    );

    expect(mockGradient).toHaveBeenCalledTimes(2);
    expect(mockGradient).toHaveBeenCalledWith(
      expect.objectContaining({ cx: 340, cy: 40, r: 150, gradientUnits: "userSpaceOnUse" }),
    );
  });
});
