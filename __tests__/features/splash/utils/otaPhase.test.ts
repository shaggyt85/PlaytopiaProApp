import { otaPhase, type OtaSnapshot } from "@/features/splash/utils/otaPhase";

const quiet: OtaSnapshot = {
  isStartupProcedureRunning: false,
  isChecking: false,
  isDownloading: false,
  isUpdatePending: false,
  isRestarting: false,
};

describe("otaPhase", () => {
  it("sin nada en marcha no hay que esperar", () => {
    expect(otaPhase(quiet)).toBe("idle");
  });

  it("preguntando al servidor, o con el arranque de expo-updates en curso", () => {
    expect(otaPhase({ ...quiet, isChecking: true })).toBe("checking");
    expect(otaPhase({ ...quiet, isStartupProcedureRunning: true })).toBe("checking");
  });

  it("bajando la actualización, aunque el arranque siga en curso", () => {
    expect(otaPhase({ ...quiet, isStartupProcedureRunning: true, isDownloading: true })).toBe("downloading");
  });

  it("descargada o reiniciando: toca reiniciar", () => {
    expect(otaPhase({ ...quiet, isUpdatePending: true })).toBe("restarting");
    expect(otaPhase({ ...quiet, isRestarting: true })).toBe("restarting");
  });
});
