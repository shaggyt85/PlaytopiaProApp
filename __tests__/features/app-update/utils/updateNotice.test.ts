import { updateNotice } from "@/features/app-update/utils/updateNotice";

const check = (update_type: "force" | "soft" | "none") => ({
  update_type,
  store_url: { ios: null, android: null },
});

describe("updateNotice", () => {
  it("el aviso que decide Core", () => {
    expect(updateNotice(check("force"))).toBe("force");
    expect(updateNotice(check("soft"))).toBe("soft");
    expect(updateNotice(check("none"))).toBe("none");
  });

  it("sin respuesta de Core (no llegó o falló), ninguno: no se bloquea por la red", () => {
    expect(updateNotice(undefined)).toBe("none");
  });
});
