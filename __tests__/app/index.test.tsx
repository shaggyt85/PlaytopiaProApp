import { render } from "@testing-library/react-native";

import Index from "@/app/index";

describe("pantalla inicial", () => {
  it("se monta sin errores", () => {
    const { toJSON } = render(<Index />);

    expect(toJSON()).not.toBeNull();
  });
});
