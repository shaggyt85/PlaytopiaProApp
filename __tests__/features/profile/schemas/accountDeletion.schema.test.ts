import {
  AccountDeletionSchema,
  DeleteAccountFormSchema,
  REASON_MAX_LENGTH,
} from "@/features/profile/schemas/accountDeletion.schema";

const issues = (reason: string) =>
  DeleteAccountFormSchema.safeParse({ reason }).error?.issues.map((issue) => issue.message) ?? [];

describe("DeleteAccountFormSchema", () => {
  it("un motivo de 10 caracteres vale, sin los espacios de los lados", () => {
    expect(DeleteAccountFormSchema.parse({ reason: "  Me cambio.  " })).toEqual({ reason: "Me cambio." });
  });

  it("menos de 10 caracteres (sin contar los espacios) no vale, como en Core", () => {
    expect(issues("   corto    ")).toEqual(["validation.reasonMin"]);
  });

  it("más de 1000 no vale, como en Core", () => {
    expect(issues("a".repeat(REASON_MAX_LENGTH + 1))).toEqual(["validation.reasonMax"]);
  });
});

describe("AccountDeletionSchema", () => {
  it("el resumen de un profesor y los días hasta borrar sus datos; el message de Core no se usa", () => {
    const parsed = AccountDeletionSchema.parse({
      summary: { schools_count: 1, clubs_count: 2, unassigned_sessions: 3 },
      anonymize_after_days: 30,
      message: "Tu cuenta se ha dado de baja…",
    });

    expect(parsed).toEqual({ summary: { schools_count: 1, clubs_count: 2, unassigned_sessions: 3 }, anonymize_after_days: 30 });
  });

  it("el resumen de un alumno no cumple el contrato del profesor", () => {
    const student = { summary: { schools_count: 1, enrollments_count: 2, subscriptions_count: 0 }, anonymize_after_days: 30 };

    expect(AccountDeletionSchema.safeParse(student).success).toBe(false);
  });
});
