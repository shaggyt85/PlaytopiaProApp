import { CachePolicy } from "@/shared/config/cachePolicies";

describe("CachePolicy", () => {
  it("cada política estática es más fresca que la anterior", () => {
    expect(CachePolicy.STATIC.staleTime).toBeGreaterThan(CachePolicy.STANDARD.staleTime);
    expect(CachePolicy.STANDARD.staleTime).toBeGreaterThan(CachePolicy.LIVE.staleTime);
    expect(CachePolicy.LIVE.staleTime).toBeGreaterThan(CachePolicy.ALWAYS_FRESH.staleTime);
  });

  it("LIVE refresca al volver a la app; STANDARD no", () => {
    expect(CachePolicy.LIVE.refetchOnWindowFocus).toBe(true);
    expect(CachePolicy.STANDARD.refetchOnWindowFocus).toBe(false);
  });

  it("ALWAYS_FRESH vuelve a pedir siempre al montar", () => {
    expect(CachePolicy.ALWAYS_FRESH.refetchOnMount).toBe("always");
  });

  describe("POLLING", () => {
    type Datos = { items: { pending: boolean }[] };
    const policy = CachePolicy.POLLING<Datos>(30_000, (data) =>
      data?.items.some((i) => i.pending) ?? false,
    );
    const query = (data?: Datos) => ({ state: { data } });

    it("pregunta cada intervalo mientras quede algo pendiente", () => {
      expect(policy.refetchInterval(query({ items: [{ pending: true }] }))).toBe(30_000);
    });

    it("deja de preguntar cuando ya no hay nada pendiente o no hay datos", () => {
      expect(policy.refetchInterval(query({ items: [{ pending: false }] }))).toBe(false);
      expect(policy.refetchInterval(query())).toBe(false);
    });

    it("nunca pregunta en segundo plano", () => {
      expect(policy.refetchIntervalInBackground).toBe(false);
    });
  });
});
