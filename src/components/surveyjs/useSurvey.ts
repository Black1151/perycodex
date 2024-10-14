import {useState, useEffect} from 'react';
import {Model, Serializer, settings, SurveyModel} from 'survey-core';

import {
    registerSurveyFunctionsWithoutSurvey,
    registerSurveyJsFunctionsWithSurvey
} from "@/components/surveyjs/globalJsFunctions";
import {ThemeModule, UseSurveyProps} from "@/components/surveyjs/SurveyProps";

const useSurvey = ({
                       surveyJson,
                       isNew,
                       dataset,
                       cssPath,
                       sjsPath,
                       jsPath
                   }: UseSurveyProps) => {

    const [model, setModel] = useState<SurveyModel | null>(null);
    const [isLoading, setIsLoading] = useState(true);  // New loading state

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

        const model = new Model(surveyJson);

        // Custom Sedulo Functions that need to be registered
        registerSurveyFunctionsWithoutSurvey();

        // Custom Sedulo Functions that need to be registered
        registerSurveyJsFunctionsWithSurvey(model);

        // Register all the custom SVG Icons
        const applyJsPath = async (): Promise<void> => {
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
                        await jsModule.applyJsWithSurvey(model); // Pass the survey object if necessary
                    } else {
                        console.error(`applyJsWithSurvey function not found in module at path: ${jsPath}`);
                    }

                } catch (error) {
                    console.error(`Error loading JS functions from path: ${jsPath}`, error);
                }
            } else {
                console.log("No JS path supplied")
            }
        };

        applyJsPath();

        // Dynamically import and apply `themeJson` based on `sjsPath` prop
        const applyTheme = async (): Promise<void> => {
            if (sjsPath) {
                try {
                    const themeModule: ThemeModule = await import(`@/theme/sjsPath/${sjsPath}`); // Construct the path dynamically
                    if (themeModule.themeJson) {
                        await model.applyTheme(themeModule.themeJson);
                    } else {
                        console.error(`themeJson not found in module at path: ${sjsPath}`);
                    }
                } catch (error) {
                    console.error(`Error loading SurveyJS theme from path: ${sjsPath}`, error);
                }
            }

            setIsLoading(false);  // Set loading state to false once theme is applied
        };

        // Call applyTheme to ensure it's applied asynchronously
        applyTheme();

        model.onOpenDropdownMenu.add((_, options) => {
            options.menuType = "dropdown"
        });

        const user = {
            name: "Oliver",
            number: "07375851855"
        }; // TODO: Make this a PROP or able to get this from state
        // Set Common Variables that will be needed within the survey
        model.setVariable("setUserDetails", user);

        // Set survey to read-only mode depending on state of isEditing
        if (isNew) {
            model.mode = "edit";
        } else {
            model.mode = "display";
        }

        // Allow form to know if formMode is in edit or display mode
        if (!isNew) {
            model.setVariable("formMode", "edit");
        } else {
            model.setVariable("formMode", "new");
        }

        // If data exists then apply it here
        if (dataset) {
            model.data = dataset;
        }

        // Survey dataset to include fields that are hidden (not default)
        model.clearInvisibleValues = false;

        setModel(model);  // Set the model after everything is initialized

    }, [surveyJson]);

    return {model, isLoading};  // Return loading state to control rendering
};

export default useSurvey;
