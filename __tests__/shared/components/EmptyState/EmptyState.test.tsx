import { fireEvent, render, screen } from "@testing-library/react-native";

import { EmptyState } from "@/shared/components/EmptyState";

describe("EmptyState", () => {
  it("muestra título y mensaje", () => {
    render(<EmptyState title="Sin clases hoy" message="Disfruta el descanso" />);

    expect(screen.getByText("Sin clases hoy")).toBeTruthy();
    expect(screen.getByText("Disfruta el descanso")).toBeTruthy();
  });

  it("la acción solo aparece con texto y manejador", () => {
    const onAction = jest.fn();
    const { rerender } = render(<EmptyState title="Vacío" actionLabel="Crear" />);
    expect(screen.queryByRole("button")).toBeNull();

    rerender(<EmptyState title="Vacío" actionLabel="Crear" onAction={onAction} />);
    fireEvent.press(screen.getByRole("button", { name: "Crear" }));

    expect(onAction).toHaveBeenCalledTimes(1);
  });
});
