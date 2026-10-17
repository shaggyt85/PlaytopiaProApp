import { firstError, SIGN_IN_BUTTON_TITLE, signInMode } from "@/features/auth/utils/signInMode";
import { hasTranslation } from "@/shared/config/i18n";

describe("signInMode", () => {
  it("la biometría manda; si no, «Registrarse» cuando no se encontró; si no, «Continuar»", () => {
    expect(signInMode({ useBiometric: true, notFound: true })).toBe("biometric");
    expect(signInMode({ useBiometric: false, notFound: true })).toBe("register");
    expect(signInMode({ useBiometric: false, notFound: false })).toBe("continue");
  });

  it("cada modo con su texto traducido", () => {
    for (const key of Object.values(SIGN_IN_BUTTON_TITLE)) expect(hasTranslation(key)).toBe(true);
  });
});

describe("firstError", () => {
  it("el primero que haya, en orden; sin ninguno, nada", () => {
    expect(firstError("biometría", "no encontrado")).toBe("biometría");
    expect(firstError(null, false, "comprobación")).toBe("comprobación");
    expect(firstError(null, false, undefined)).toBeNull();
  });
});
