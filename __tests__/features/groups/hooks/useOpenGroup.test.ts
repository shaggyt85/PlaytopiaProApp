import { renderHook } from "@testing-library/react-native";
import { useRouter } from "expo-router";

import { useOpenGroup } from "@/features/groups/hooks/useOpenGroup";

import { scheduleClass } from "../../../helpers/scheduleFactories";

jest.mock("expo-router", () => ({ useRouter: jest.fn() }));

const router = { push: jest.fn() };
const group = (group_id: number | null) => ({
  key: "k",
  next: scheduleClass({ db_id: 4, id: 31, group_id, class_date: "2026-10-06" }),
  weekdayDates: ["2026-10-06"],
  upcoming: 1,
});

describe("useOpenGroup", () => {
  beforeEach(() => jest.mocked(useRouter).mockReturnValue(router as never));

  it("abre el detalle del grupo", () => {
    renderHook(() => useOpenGroup()).result.current(group(11));

    expect(router.push).toHaveBeenCalledWith({ pathname: "/group/[dbId]/[groupId]", params: { dbId: "4", groupId: "11" } });
  });

  it("una clase antigua sin grupo abre la clase", () => {
    renderHook(() => useOpenGroup()).result.current(group(null));

    expect(router.push).toHaveBeenCalledWith({
      pathname: "/class/[dbId]/[classId]",
      params: { dbId: "4", classId: "31", date: "2026-10-06" },
    });
  });
});
