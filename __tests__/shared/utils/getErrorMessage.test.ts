import { changeLanguage } from "@/shared/config/i18n";
import { HttpError } from "@/shared/services/HttpError";
import { getErrorMessage } from "@/shared/utils/getErrorMessage";

const problem = (type: string, status: number) =>
  HttpError.fromResponse(status, { type, status, detail: "prosa interna de Core" });

describe("getErrorMessage", () => {
  it("usa la traducción del type de Core si existe", () => {
    expect(getErrorMessage(problem("urn:playtopia:problem:server-overloaded", 503))).toBe(
      "El servidor está saturado. Inténtalo en unos minutos.",
    );
  });

  it("los dos errores de un rango de fechas tienen su propio texto", () => {
    expect(getErrorMessage(problem("urn:playtopia:problem:date-range-inverted", 400))).toBe(
      "La fecha de inicio no puede ser posterior a la de fin.",
    );
    expect(getErrorMessage(problem("urn:playtopia:problem:date-range-too-long", 400))).toBe(
      "El rango de fechas es demasiado largo.",
    );
  });

  it("si el type no está traducido, usa el texto de su status", () => {
    expect(getErrorMessage(problem("urn:playtopia:problem:group-full", 409))).toBe(
      "Esta acción choca con datos que ya existen.",
    );
  });

  it("cualquier 5xx sin traducción usa el texto de 500", () => {
    expect(getErrorMessage(HttpError.fromResponse(502, "<html>"))).toBe(
      "Error del servidor. Inténtalo más tarde.",
    );
  });

  it("un status sin texto propio usa el genérico", () => {
    expect(getErrorMessage(HttpError.fromResponse(418, {}))).toBe(
      "Algo salió mal. Inténtalo de nuevo.",
    );
  });

  it("red, timeout y errores que no son HttpError", () => {
    expect(getErrorMessage(HttpError.network())).toBe(
      "Sin conexión. Revisa tu red e inténtalo de nuevo.",
    );
    expect(getErrorMessage(HttpError.timeout())).toBe(
      "La conexión tardó demasiado. Inténtalo de nuevo.",
    );
    expect(getErrorMessage(new Error("x"))).toBe("Algo salió mal. Inténtalo de nuevo.");
  });

  it("nunca enseña el detail de Core", () => {
    const message = getErrorMessage(problem("urn:playtopia:problem:group-full", 409));
    expect(message).not.toContain("prosa interna");
  });

  it("sigue el idioma activo", async () => {
    await changeLanguage("en");
    expect(getErrorMessage(HttpError.network())).toBe(
      "No connection. Check your network and try again.",
    );
  });
});
