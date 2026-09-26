import { render } from "@testing-library/react-native";

import { BrandLogo } from "@/shared/components/BrandLogo";

const mockImage = jest.fn();
jest.mock("expo-image", () => ({
  Image: (props: Record<string, unknown>) => {
    mockImage(props);
    return null;
  },
}));

describe("BrandLogo", () => {
  it("usa la caché en memoria y sin fundido, al tamaño pedido", () => {
    render(<BrandLogo size={100} />);

    expect(mockImage).toHaveBeenCalledWith(
      expect.objectContaining({
        cachePolicy: "memory-disk",
        transition: 0,
        style: [{ width: 100, height: 100 }, undefined],
      }),
    );
  });
});
