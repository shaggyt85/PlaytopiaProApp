import { signInNextStep } from "@/features/auth/utils/signInNextStep";

describe("signInNextStep", () => {
  it("un profesor con contraseña va a la contraseña", () => {
    expect(signInNextStep({ is_teacher: true, teacher_needs_password_setup: false })).toBe(
      "password",
    );
  });

  it("un profesor sin contraseña va a crearla", () => {
    expect(signInNextStep({ is_teacher: true, teacher_needs_password_setup: true })).toBe(
      "passwordSetup",
    );
  });

  it("quien no es profesor va al registro, aunque llegara el aviso", () => {
    // Core solo lo pone con una cuenta de profesor; si llegara solo, manda is_teacher.
    expect(signInNextStep({ is_teacher: false, teacher_needs_password_setup: false })).toBe(
      "register",
    );
    expect(signInNextStep({ is_teacher: false, teacher_needs_password_setup: true })).toBe(
      "register",
    );
  });
});
