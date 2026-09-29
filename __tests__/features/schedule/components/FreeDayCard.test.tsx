import { render, screen } from "@testing-library/react-native";

import { FreeDayCard } from "@/features/schedule/components/FreeDayCard";

describe("FreeDayCard", () => {
  it("dice que el día está libre", () => {
    render(<FreeDayCard />);

    expect(screen.getByText("Día libre · sin compromisos")).toBeTruthy();
  });
});
