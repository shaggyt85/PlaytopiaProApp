import { clubBreakdown, currentMonth, historyBars, monthClubsDetail, progress } from "@/features/profile/utils/monthHours";
import { darkTheme } from "@/shared/config/theme";
import type { ClubOf } from "@/shared/hooks/useScheduleClubs";

import { profileClub, profileDetails } from "../../../helpers/profileFactories";

/** Lo hecho y lo planificado de una sede o un mes, con una clase por hora. */
const tally = (done_minutes: number, planned_minutes: number) => ({
  planned_minutes,
  done_minutes,
  planned_classes: planned_minutes / 60,
  done_classes: done_minutes / 60,
});

const month = (key: string, clubs: { club_id: number; done: number; planned: number }[]) => ({
  month: key,
  total: tally(
    clubs.reduce((sum, c) => sum + c.done, 0),
    clubs.reduce((sum, c) => sum + c.planned, 0),
  ),
  clubs: clubs.map(({ club_id, done, planned }) => ({ db_id: 7, club_id, ...tally(done, planned) })),
});

const CLUBS = [
  { ...profileClub, club_id: 70, club_name: "Centro" },
  { ...profileClub, club_id: 71, club_name: "Norte" },
];

/** La agenda conoce la 70 (con su nombre corto y su color); la 71 ya no está en «Mis clubes». */
const clubOf: ClubOf = (sede) =>
  sede.club_id === 70
    ? { label: "Indoor Centro", colors: darkTheme.clubColors[0] }
    : { label: "", colors: darkTheme.clubColorUnknown };

describe("currentMonth", () => {
  it("el primero que manda Core: el mes en curso", () => {
    expect(currentMonth(profileDetails().hours)?.month).toBe("2026-10");
  });

  it("sin meses, ninguno", () => {
    expect(currentMonth({ clubs: [], months: [] })).toBeUndefined();
  });
});

describe("progress", () => {
  it("lo hecho sobre lo planificado", () => {
    expect(progress({ done_minutes: 540, planned_minutes: 720 })).toBe(0.75);
  });

  it("todo hecho, llena", () => {
    expect(progress({ done_minutes: 720, planned_minutes: 720 })).toBe(1);
  });

  it("sin nada planificado, vacía: sin dividir entre cero", () => {
    expect(progress({ done_minutes: 0, planned_minutes: 0 })).toBe(0);
  });
});

describe("clubBreakdown", () => {
  it("cada sede con lo hecho, lo planificado y su avance, en el orden de Core", () => {
    const rows = clubBreakdown(
      month("2026-10", [
        { club_id: 71, done: 60, planned: 240 },
        { club_id: 70, done: 540, planned: 720 },
      ]),
      CLUBS,
      clubOf,
    );

    expect(rows.map(({ key, doneMinutes, plannedMinutes, share }) => [key, doneMinutes, plannedMinutes, share])).toEqual([
      ["7-71", 60, 240, 0.25],
      ["7-70", 540, 720, 0.75],
    ]);
  });

  it("con el nombre y el color de la agenda; si la sede ya no está, el nombre de Core", () => {
    const [norte, centro] = clubBreakdown(
      month("2026-10", [
        { club_id: 71, done: 60, planned: 60 },
        { club_id: 70, done: 60, planned: 60 },
      ]),
      CLUBS,
      clubOf,
    );

    expect(centro).toMatchObject({ label: "Indoor Centro", colors: darkTheme.clubColors[0] });
    expect(norte).toMatchObject({ label: "Norte", colors: darkTheme.clubColorUnknown });
  });
});

describe("historyBars", () => {
  it("cada mes con lo hecho, lo planificado, sus clases y su avance; el primero, el actual", () => {
    const bars = historyBars([
      month("2026-10", [{ club_id: 70, done: 300, planned: 600 }]),
      month("2026-09", [{ club_id: 70, done: 600, planned: 600 }]),
    ]);

    expect(bars).toEqual([
      { month: "2026-10", doneMinutes: 300, plannedMinutes: 600, doneClasses: 5, plannedClasses: 10, share: 0.5, current: true },
      { month: "2026-09", doneMinutes: 600, plannedMinutes: 600, doneClasses: 10, plannedClasses: 10, share: 1, current: false },
    ]);
  });

  it("los meses sin nada planificado no salen: no trabajó", () => {
    const bars = historyBars([
      month("2026-10", [{ club_id: 70, done: 60, planned: 120 }]),
      month("2026-09", []),
      month("2026-08", [{ club_id: 70, done: 0, planned: 0 }]),
      month("2026-07", [{ club_id: 70, done: 60, planned: 60 }]),
    ]);

    expect(bars.map((bar) => bar.month)).toEqual(["2026-10", "2026-07"]);
    expect(bars[0].current).toBe(true);
  });

  it("si el mes en curso no tiene nada planificado, no sale ni se marca otro como actual", () => {
    const bars = historyBars([month("2026-10", []), month("2026-09", [{ club_id: 70, done: 60, planned: 60 }])]);

    expect(bars).toEqual([expect.objectContaining({ month: "2026-09", current: false })]);
  });
});

describe("monthClubsDetail", () => {
  const rows = (...planned: number[]) =>
    clubBreakdown(
      month("2026-09", planned.map((minutes, i) => ({ club_id: 70 + i, done: minutes, planned: minutes }))),
      CLUBS,
      clubOf,
    );

  it("con una sola sede, nada: sus horas son las del mes", () => {
    expect(monthClubsDetail(rows(240))).toEqual([]);
  });

  it("con dos o más, cada una", () => {
    expect(monthClubsDetail(rows(240, 120)).map((club) => club.key)).toEqual(["7-70", "7-71"]);
  });

  it("una sede sin nada planificado ese mes no cuenta", () => {
    expect(monthClubsDetail(rows(240, 0))).toEqual([]);
  });
});
