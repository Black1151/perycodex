// import {FunctionFactory} from "survey-core";
// import nexusApi from "@/utils/nexusApi";
//
// /**
//  * Retrieves a specific property from an object that is the original item of a dropdown choice.
//  * This function assumes that the dropdown has been configured with "attachOriginalItems: true".
//  *
//  * @props survey - The SurveyJS model instance.
//  * @returns A function that takes an array of strings as arguments.
//  *          - props[0]: The name of the dropdown question in the survey.
//  *          - props[1]: The property name to retrieve from the original item of the selected dropdown choice.
//  * @throws An error if the dropdown or the selected item is not found.
//  */
// const getObjectFieldFromDropdown = (survey) => (props) => {
//
//     const dropdown = survey.getQuestionByName(props[0]);
//
//
//     if (!dropdown) {
//         return 0;
//     }
//     if (!dropdown.selectedItem) {
//         return 0;
//     }
//
//     if (dropdown.selectedItem.originalItem && dropdown.selectedItem.originalItem[props[1]]) {
//         return dropdown.selectedItem.originalItem[props[1]];
//     }
// };
//
// /**
//  * Retrieves a specific property from a question in the survey that holds an object.
//  *
//  * @props survey - The SurveyJS model instance.
//  * @returns A function that takes an array of strings as arguments.
//  *          - props[0]: The name of the key in the survey data.
//  *          - props[1]: The property name to retrieve from the object.
//  * @throws An error if the question is not found or does not contain the specified property.
//  */
// const getObjectField = (survey) => (props) => {
//     const [questionKey, propertyName] = props;
//
//     // Validate the questionKey
//     if (!questionKey) {
//         return 0;
//     }
//
//     // Validate the propertyName
//     if (!propertyName) {
//         return 0;
//     }
//
//     // Retrieve the question data from the survey
//     const questionData = survey.data[questionKey];
//
//     // Validate the question data
//     if (!questionData || typeof questionData !== "object") {
//         return 0;
//         throw new Error(
//             `The question with key '${questionKey}' does not exist or is not an object.`
//         );
//     }
//
//     // Retrieve the property from the question data
//     const propertyValue = questionData[propertyName];
//
//     // Validate the property
//     if (propertyValue === undefined) {
//         return 0;
//         throw new Error(
//             `The property '${propertyName}' does not exist in the question with key '${questionKey}'.`
//         );
//     }
//
//     // Return the retrieved property value
//     return propertyValue;
// };
//
// /**
//  * Sets the image link for an image question based on a property from a selected dropdown item.
//  * This assumes the dropdown question has "attachOriginalItems: true" set and the selected item has an image URL.
//  *
//  * @props survey - The SurveyJS model instance.
//  * @returns A function that takes an array of strings as arguments.
//  *          - props[0]: The name of the dropdown question in the survey.
//  *          - props[1]: The name of the image question in the survey.
//  *          - props[2]: The property name of the image URL in the original item of the selected dropdown choice.
//  * @throws An error if the dropdown or image field is not found, or if the selected item does not have the specified image URL.
//  */
// const setImageField = (survey) => (props) => {
//     const dropdown = survey.getQuestionByName(props[0]);
//     const imageField = survey.getQuestionByName(props[1]);
//     if (!dropdown) {
//         throw new Error(`Dropdown with name "${props[0]}" not found.`);
//     }
//     if (!dropdown.selectedItem) {
//         throw new Error(`No item is selected in the dropdown "${props[0]}".`);
//     }
//     if (!imageField) {
//         throw new Error(`Image field with name "${props[1]}" not found.`);
//     }
//     if (imageField.jsonObj.type !== "image") {
//         throw new Error(`Question "${props[1]}" is not of type 'image'.`);
//     }
//     const imageUrl = dropdown.selectedItem.originalItem[props[2]];
//     if (!imageUrl) {
//         throw new Error(
//             `Property "${props[2]}" not found in the selected dropdown item.`
//         );
//     }
//     imageField.imageLink = imageUrl;
// };
//
// /**
//  * Sends a request to the Sedulo Nexus endpoint and processes the response.
//  *
//  * @param {Array} props - Array containing the API endpoint, filter query, and optional key mapping string.
//  *        - props[0]: API endpoint resource, used to determine the correct endpoint for data population.
//  *        - props[1]: Filter query, appended to the end of the API call.
//  *        - props[2]: Optional field mapping string, allows renaming fields from the API to more meaningful names in SurveyJS.
//  * @returns {Promise<*>} The transformed data or an empty array in case of an error.
//  */
// async function nexusApiRequest([endpoint, value, mappings]) {
//     // Early return for invalid input
//     if (!endpoint || value == null) {
//         return 0;
//     }
//
//     try {
//         // Construct the URL using the base URL and props
//         const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}/${value}`;
//
//         // Make the GET request using nexusApi
//         const response = await nexusApi.get(url);
//
//         // Extract and ensure data is an array
//         let data = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
//
//         // Apply key mappings if provided
//         if (mappings) {
//             data = applyKeyMappings(data, mappings);
//         }
//
//         // Return the result through the appropriate method
//         return this.returnResult(data);
//     } catch (error) {
//         return []; // Return an empty array in case of error
//     }
// }
//
// /**
//  * Applies key mappings to each object in the data array.
//  *
//  * @param {Array} data - Array of objects to transform.
//  * @param {String} mappingString - Mapping string in the format "originalKey:newKey|originalKey2:newKey2".
//  * @returns {Array} The transformed data array with keys replaced.
//  */
// function applyKeyMappings(data, mappingString) {
//     const mappings = mappingString.split("|").map(mapping => mapping.split(":").map(str => str.trim()));
//
//     return data.map(item => {
//         const newItem = {};
//         for (const key in item) {
//             const newKey = mappings.find(([originalKey]) => originalKey === key)?.[1] || key;
//             newItem[newKey] = item[key];
//         }
//         return newItem;
//     });
// }
//
//
//
// // Function to sum up values of a array form object
// // This is to help us on the businessScore
// const arraySum = (props) => {
//     var arr = props[0];
//     if (!arr || !Array.isArray(arr)) return 0;
//     var sum = 0;
//     for (const item of props[0]) {
//         const score = parseInt(item[props[1]], 10);
//         sum += score;
//     }
//     return sum;
// };
//
// // Function to validate Json on a JSON MASK INPUT
// const validateJson = (props) => {
//     const jsonInput = props[0];
//
//     // Check if the input is empty
//     if (!jsonInput) {
//         return true;  // Allow empty input
//     }
//
//     // Validate if the input is a valid JSON
//     try {
//         JSON.parse(jsonInput);
//         return true;  // It's valid JSON
//     } catch (e) {
//         return false;  // Invalid JSON
//     }
// };
//
//
// // Function to decode a single JSON object and return as a string
// const decodeJson = (props) => {
//     if (!props[0]) {
//         return "";
//     } else {
//         return JSON.stringify(props[0], null, 2);
//     }
// };
//
// // Registers every function below with the appropriate name
// export const registerSurveyFunctionsWithoutSurvey = () => {
//     FunctionFactory.Instance.register("nexusApiRequest", nexusApiRequest, true);
//     FunctionFactory.Instance.register("validateJson", validateJson);
//     FunctionFactory.Instance.register("decodeJson", decodeJson);
//     FunctionFactory.Instance.register("arraySum", arraySum);
// };
//
// export const registerSurveyJsFunctionsWithSurvey = (survey) => {
//     FunctionFactory.Instance.register("getObjectFieldFromDropdown", getObjectFieldFromDropdown(survey));
//     FunctionFactory.Instance.register("getObjectField", getObjectField(survey));
//     FunctionFactory.Instance.register("setImageField", setImageField(survey));
// }
