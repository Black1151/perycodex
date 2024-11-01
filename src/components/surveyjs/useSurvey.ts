import {useEffect, useState} from 'react';
import {Model, Serializer, settings, SurveyModel} from 'survey-core';

import {
    registerSurveyFunctionsWithoutSurvey,
    registerSurveyJsFunctionsWithSurvey
} from "@/components/surveyjs/globalJsFunctions";
import {ThemeModule, UseSurveyProps} from "@/components/surveyjs/SurveyProps";
import {useUser} from "@/providers/UserProvider";

const useSurvey = ({
                       surveyJson,
                       isNew,
                       dataset,
                       includeVariables,
                       sjsPath,
                       jsPath
                   }: UseSurveyProps) => {

    const [model, setModel] = useState<SurveyModel | null>(null);
    const [isLoading, setIsLoading] = useState(true);  // New loading state
    const {user} = useUser();

    // ? Global Setting

    // Ensure choicesRestful works with authorization
    settings.web.onBeforeRequestChoices = (sender, options) => {
        options.request.withCredentials = true;
        options.request.setRequestHeader("Accept", "application/json");
    };

    // Allow ChoicesByUrl answers to be empty
    Serializer.findProperty("choicesByUrl", "allowEmptyResponse").defaultValue =
        true;

    useEffect(() => {
        if (!surveyJson) return;

        const surveyModel = new Model(surveyJson);

        // Register all the custom SVG Icons
        const applyJsPath = async (surveyModel: Model): Promise<void> => {
            if (jsPath) {
                try {
                    // Dynamically import the module based on the jsPath
                    const jsModule = await import(`@/components/surveyjs/jsPath/${jsPath}`);

                    // Check and apply the exported functions if they exist
                    if (jsModule?.applyJsWithoutSurvey) {
                        await jsModule.applyJsWithoutSurvey(); // Execute the function
                    } else {
                        console.error(`applyJsWithoutSurvey function not found in module at path: ${jsPath}`);
                    }

                    if (jsModule?.applyJsWithSurvey) {
                        await jsModule.applyJsWithSurvey(surveyModel); // Pass the survey object if necessary
                    } else {
                        console.error(`applyJsWithSurvey function not found in module at path: ${jsPath}`);
                    }

                } catch (error) {
                    console.error(`Error loading JS functions from path: ${jsPath}`, error);
                }
            } else {
                // console.log("No JS path supplied")
            }
        };

        // Dynamically import and apply `themeJson` based on `sjsPath` prop
        const applyTheme = async (surveyModel: Model): Promise<void> => {
            if (sjsPath) {
                try {
                    const themeModule: ThemeModule = await import(`@/theme/sjsPath/${sjsPath}`); // Construct the path dynamically
                    if (themeModule.themeJson) {
                        surveyModel.applyTheme(themeModule.themeJson);
                    } else {
                        console.error(`themeJson not found in module at path: ${sjsPath}`);
                    }
                } catch (error) {
                    console.error(`Error loading SurveyJS theme from path: ${sjsPath}`, error);
                }
            }

            setIsLoading(false);  // Set loading state to false once theme is applied
        };

        const initializeSurvey = async (surveyModel: Model) => {
            await applyJsPath(surveyModel);
            await applyTheme(surveyModel);

            surveyModel.onOpenDropdownMenu.add((_, options) => {
                options.menuType = "dropdown"
            });

            // Set Common Variables that will be needed within the survey
            surveyModel.setVariable("pgv_currentUser", user);

            // Set survey to read-only mode depending on state of isEditing
            surveyModel.mode = isNew ? "edit" : "display";

            // Allow form to know if formMode is in edit or display mode
            surveyModel.setVariable("pgv_formMode", isNew ? "new" : "edit");

            // Dynamically go through the list of objects and set the entire nested object as a variable
            if (includeVariables && Array.isArray(includeVariables)) {
                includeVariables.forEach(variableObject => {
                    // Extract the top-level key (e.g., userDetails, companyInfo)
                    Object.keys(variableObject).forEach(key => {
                        // Set the entire nested object as a variable with the "pgv_" prefix
                        const value = variableObject[key];
                        surveyModel.setVariable(`wfv_${key}`, value);
                    });
                });
            }

            // If data exists then apply it here
            if (dataset) {
                surveyModel.data = dataset;
            }

            // Survey dataset to include fields that are hidden (not default)
            surveyModel.clearInvisibleValues = false;

            setModel(surveyModel);  // Set the model after everything is initialized
            setIsLoading(false);  // Set loading state to false
        }

        initializeSurvey(surveyModel)

    }, [surveyJson]);

    return {model, isLoading};  // Return loading state to control rendering
};

export default useSurvey;
