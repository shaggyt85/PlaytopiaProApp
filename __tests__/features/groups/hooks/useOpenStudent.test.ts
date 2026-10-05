import { renderHook } from "@testing-library/react-native";
import { useRouter } from "expo-router";

import { useOpenStudent } from "@/features/groups/hooks/useOpenStudent";

jest.mock("expo-router", () => ({ useRouter: jest.fn() }));

const router = { push: jest.fn() };

describe("useOpenStudent", () => {
  beforeEach(() => jest.mocked(useRouter).mockReturnValue(router as never));

  it("abre la ficha del alumno en su grupo", () => {
    renderHook(() => useOpenStudent(4, 11)).result.current({ student_id: 55 });

    expect(router.push).toHaveBeenCalledWith({
      pathname: "/student/[dbId]/[groupId]/[studentId]",
      params: { dbId: "4", groupId: "11", studentId: "55" },
    });
  });

  it("la misma para el mismo grupo: las filas no se repintan por ella", () => {
    const { result, rerender } = renderHook(() => useOpenStudent(4, 11));
    const first = result.current;

    rerender({});

    expect(result.current).toBe(first);
  });
});
