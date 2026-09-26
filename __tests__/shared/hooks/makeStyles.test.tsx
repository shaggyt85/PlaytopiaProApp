import { renderHook } from "@testing-library/react-native";

import { darkTheme } from "@/shared/config/theme";
import { makeStyles } from "@/shared/hooks/makeStyles";
import { useTheme } from "@/shared/hooks/useTheme";

describe("useTheme", () => {
  it("por ahora siempre devuelve el tema oscuro", () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current).toBe(darkTheme);
  });
});

describe("makeStyles", () => {
  const useStyles = makeStyles((theme) => ({
    box: { backgroundColor: theme.colors.primary, padding: theme.spacing.md },
  }));

  it("crea los estilos a partir del tema", () => {
    const { result } = renderHook(() => useStyles());
    expect(result.current.box).toEqual({
      backgroundColor: darkTheme.colors.primary,
      padding: darkTheme.spacing.md,
    });
  });

  it("no rehace los estilos en cada render", () => {
    const { result, rerender } = renderHook(() => useStyles());
    const first = result.current;
    rerender({});
    expect(result.current).toBe(first);
  });
});
