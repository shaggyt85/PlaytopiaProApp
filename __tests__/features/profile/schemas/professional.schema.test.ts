import {
  DESCRIPTION_MAX_LENGTH,
  EXPERIENCE_YEARS_MAX,
  ProfessionalFormSchema,
  toProfessionalRequest,
} from "@/features/profile/schemas/professional.schema";

const form = { experienceYears: 6, description: "Entrenador", sports: [{ code: "padel", specialties: ["technique"] }] };

describe("ProfessionalFormSchema", () => {
  it("acepta el perfil profesional, también sin deportes (como Core)", () => {
    expect(ProfessionalFormSchema.safeParse(form).success).toBe(true);
    expect(ProfessionalFormSchema.safeParse({ ...form, sports: [] }).success).toBe(true);
  });

  it("los años, de 0 al tope de Core, o sin decir", () => {
    expect(ProfessionalFormSchema.safeParse({ ...form, experienceYears: null }).success).toBe(true);
    expect(ProfessionalFormSchema.safeParse({ ...form, experienceYears: EXPERIENCE_YEARS_MAX + 1 }).success).toBe(false);
    expect(ProfessionalFormSchema.safeParse({ ...form, experienceYears: -1 }).success).toBe(false);
  });

  it("la presentación, hasta el tope de Core, con su clave de i18n", () => {
    const result = ProfessionalFormSchema.safeParse({ ...form, description: "x".repeat(DESCRIPTION_MAX_LENGTH + 1) });

    expect(result.error?.issues[0].message).toBe("validation.descriptionMax");
  });
});

describe("toProfessionalRequest", () => {
  it("el formulario como lo espera Core", () => {
    expect(toProfessionalRequest(form)).toEqual({
      description: "Entrenador",
      experience_years: 6,
      sports: [{ code: "padel", specialties: ["technique"] }],
    });
  });

  it("una presentación vacía o en blanco se borra (null)", () => {
    expect(toProfessionalRequest({ ...form, description: "   " }).description).toBeNull();
  });
});
