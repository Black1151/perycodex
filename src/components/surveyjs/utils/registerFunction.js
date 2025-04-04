import { FunctionFactory } from "survey-core";
import { perygonApiRequest } from "./perygonApiRequest";
import { perygonArraySum } from "./perygonArraySum";
import { fetchPostcodeData } from "./fetchPostcodeData";
import { decodeJson } from "./decodeJson";
import { getObjectField } from "./getObjectField";
import { setImageField } from "./setImageField";
import { checkEqual } from "./checkEqual";
import { getObjectFieldFromDropdown } from "./getObjectFieldFromDropdown";
import { validateJson } from "./validateJson";

export const registerSurveyFunctionsWithoutSurvey = async () => {
  FunctionFactory.Instance.register(
    "fetchPostcodeData",
    fetchPostcodeData,
    true,
  );
  FunctionFactory.Instance.register(
    "perygonApiRequest",
    perygonApiRequest,
    true,
  );
  FunctionFactory.Instance.register("perygonArraySum", perygonArraySum);
  FunctionFactory.Instance.register("validateJson", validateJson);
  FunctionFactory.Instance.register("decodeJson", decodeJson);
};

export const registerSurveyFunctionsWithSurvey = async (survey) => {
  FunctionFactory.Instance.register(
    "getObjectFieldFromDropdown",
    getObjectFieldFromDropdown(survey),
  );
  FunctionFactory.Instance.register("getObjectField", getObjectField(survey));
  FunctionFactory.Instance.register("setImageField", setImageField(survey));
  FunctionFactory.Instance.register("checkEqual", checkEqual(survey));
};
