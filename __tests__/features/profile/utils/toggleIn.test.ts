import { toggleIn } from "@/features/profile/utils/toggleIn";

describe("toggleIn", () => {
  it("añade al final lo que no estaba", () => {
    expect(toggleIn(["a"], "b")).toEqual(["a", "b"]);
  });

  it("quita lo que estaba", () => {
    expect(toggleIn([1, 2, 3], 2)).toEqual([1, 3]);
  });

  it("no toca la lista de entrada", () => {
    const list = ["a"];
    toggleIn(list, "b");
    expect(list).toEqual(["a"]);
  });
});
