import { Alert } from "react-native";

import { HttpError } from "@/shared/services/HttpError";
import { alertError } from "@/shared/utils/alertError";
import { getErrorMessage } from "@/shared/utils/getErrorMessage";

describe("alertError", () => {
  beforeEach(() => jest.spyOn(Alert, "alert").mockImplementation(() => undefined));

  it("enseña el error traducido por su type, nunca el detail de Core", () => {
    const error = HttpError.fromResponse(413, {
      type: "urn:playtopia:problem:payload-too-large",
      title: "Payload Too Large",
      status: 413,
      detail: "texto interno de Core",
    });

    alertError(error);

    expect(Alert.alert).toHaveBeenCalledWith(getErrorMessage(error));
    expect(jest.mocked(Alert.alert).mock.calls[0][0]).not.toMatch(/texto interno/);
  });
});
