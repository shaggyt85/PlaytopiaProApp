import { QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";

import { useClassDetail } from "@/features/schedule/hooks/useClassDetail";
import { createQueryClient } from "@/shared/config/queryClient";
import { darkTheme } from "@/shared/config/theme";

import { scheduleClass, scheduleResponse } from "../../../helpers/scheduleFactories";
import { signInTeacher } from "../../../helpers/scheduleMocks";

const cantera = scheduleClass({ db_id: 4, id: 31, class_date: "2026-11-18" });
// La misma clase en otra escuela: el id de una clase solo es único dentro de su escuela.
const otherSchool = scheduleClass({ db_id: 5, id: 31, class_date: "2026-11-18", title: "Otra" });

function setup(getClasses: jest.Mock, dbId = 4, classId = 31) {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={createQueryClient()}>{children}</QueryClientProvider>
  );
  return renderHook(() => useClassDetail(dbId, classId, "2026-11-18", { getClasses }), { wrapper });
}

describe("useClassDetail", () => {
  beforeEach(signInTeacher);

  it("la clase de su escuela, de la respuesta del mes de su fecha", async () => {
    const getClasses = jest.fn().mockResolvedValue(scheduleResponse({ classes: [otherSchool, cantera] }));
    const { result } = setup(getClasses);

    await waitFor(() => expect(result.current.item?.title).toBe("Cantera Tarde"));
    expect(getClasses).toHaveBeenCalledWith("2026-10-26", "2026-12-06");
  });

  it("con su color en su día, el mismo que en la agenda: el de su orden entre las de ese día", async () => {
    const earlier = scheduleClass({ db_id: 4, id: 30, class_date: "2026-11-18", class_time: "08:00:00" });
    const otherDay = scheduleClass({ db_id: 4, id: 29, class_date: "2026-11-17", class_time: "07:00:00" });
    const later = { ...cantera, class_time: "18:00:00" };
    const getClasses = jest.fn().mockResolvedValue(scheduleResponse({ classes: [otherDay, later, earlier] }));
    const { result } = setup(getClasses);

    await waitFor(() => expect(result.current.item).not.toBeNull());
    // La segunda del día (la del día anterior no cuenta).
    expect(result.current.colors).toBe(darkTheme.clubColors[1]);
  });

  it("si la respuesta no la trae, null (la pantalla dice «Clase no encontrada»)", async () => {
    const getClasses = jest.fn().mockResolvedValue(scheduleResponse({ classes: [otherSchool] }));
    const { result } = setup(getClasses);

    await waitFor(() => expect(result.current.hasData).toBe(true));
    expect(result.current.item).toBeNull();
    expect(result.current.colors).toBeUndefined();
  });

  it("si falla, el error para reintentar", async () => {
    const getClasses = jest.fn().mockRejectedValue(new Error("sin red"));
    const { result } = setup(getClasses);

    await waitFor(() => expect(result.current.error).toBeTruthy());
    expect(result.current.hasData).toBe(false);
  });
});
