import { render, renderHook, screen } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { Text } from "react-native";

import { BlurTarget, BlurTargetProvider, useBlurTarget } from "@/shared/components/BlurTarget";

describe("BlurTarget", () => {
  it("pinta el contenido que se desenfocará", () => {
    render(
      <BlurTargetProvider>
        <BlurTarget>
          <Text>Pantalla</Text>
        </BlurTarget>
      </BlurTargetProvider>,
    );

    expect(screen.getByText("Pantalla")).toBeTruthy();
  });

  it("dentro del provider comparte la ref del contenido", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <BlurTargetProvider>
        <BlurTarget>
          <Text>Pantalla</Text>
        </BlurTarget>
        {children}
      </BlurTargetProvider>
    );

    const { result } = renderHook(() => useBlurTarget(), { wrapper });

    expect(result.current?.current).toBeTruthy();
  });

  it("fuera del provider no hay contenido que desenfocar", () => {
    const { result } = renderHook(() => useBlurTarget());

    expect(result.current).toBeNull();
  });
});
