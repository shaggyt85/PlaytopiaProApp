import { render, screen } from "@testing-library/react-native";

import { LoadingState } from "@/shared/components/LoadingState";
import { changeLanguage } from "@/shared/config/i18n";

describe("LoadingState", () => {
  beforeEach(async () => {
    await changeLanguage("es");
  });

  it("por defecto dice Cargando… traducido", () => {
    render(<LoadingState />);
    expect(screen.getByText("Cargando…")).toBeTruthy();
  });

  it("acepta un mensaje propio", () => {
    render(<LoadingState message="Buscando clases" />);
    expect(screen.getByText("Buscando clases")).toBeTruthy();
  });
});
