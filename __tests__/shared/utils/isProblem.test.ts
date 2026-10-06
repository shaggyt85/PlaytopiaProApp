import { HttpError } from "@/shared/services/HttpError";
import { isProblem } from "@/shared/utils/isProblem";

const problem = (type: string) => HttpError.fromResponse(409, { type, title: "Conflict", status: 409 });

describe("isProblem", () => {
  it("reconoce el problema de Core por su type, sin el prefijo", () => {
    expect(isProblem(problem("urn:playtopia:problem:email-already-registered"), "email-already-registered")).toBe(true);
  });

  it("otro type, u otro error, no", () => {
    expect(isProblem(problem("urn:playtopia:problem:conflict"), "email-already-registered")).toBe(false);
    expect(isProblem(problem("about:blank"), "email-already-registered")).toBe(false);
    expect(isProblem(HttpError.network(), "email-already-registered")).toBe(false);
    expect(isProblem(new Error("x"), "email-already-registered")).toBe(false);
  });
});
