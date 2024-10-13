import {useState, useEffect} from 'react';
import {Model, Serializer, settings, SurveyModel, SvgRegistry} from 'survey-core';

import {
    registerSurveyFunctionsWithoutSurvey,
    registerSurveyJsFunctionsWithSurvey
} from "@/components/surveyjs/customSurveyJsFunctions";
import {registerSeduloSvgIcons} from "@/components/surveyjs/registerSvgIcons";
import {UseSurveyProps} from "@/components/surveyjs/SurveyProps";
import {lightSurveyTheme} from "@/theme/surveyJsTheme";


// TODO: Theming with CSS and SJS Variables

const useSurvey = ({surveyJson, isNew, dataset}: UseSurveyProps) => {
    const [model, setModel] = useState<SurveyModel | null>(null);

    // ? Global Setting

    // Ensure choicesRestful works with authorization
    settings.web.onBeforeRequestChoices = (sender, options) => {
        options.request.withCredentials = true;
        options.request.setRequestHeader("Accept", "application/json");
    };

    // Allow ChoicesByUrl answers to be empty
    Serializer.findProperty("choicesByUrl", "allowEmptyResponse").defaultValue =
        true;

    // Disable caching of previous responses
    // settings.useCachingForChoicesRestful = false;

    useEffect(() => {
        if (!surveyJson) return;

        // Initialize the Survey model with the provided JSON
        const defaultSurveyOptions = {
            widthMode: "responsive",
            fitToContainer: true,
            showQuestionNumbers: false,
            questionErrorLocation: "bottom",
            focusOnFirstError: true,
            checkErrorsMode: "onValueChanged",
            backgroundOpacity: 0,
            showNavigationButtons: false,
            showCompletedPage: false,
            showPageTitles: false
        };

        const model = new Model(
            {
                ...defaultSurveyOptions,
                ...surveyJson
            }
        );

        // Custom Sedulo Functions that need to be registered
        registerSurveyFunctionsWithoutSurvey();

        // Custom Sedulo Functions that need to be registered
        registerSurveyJsFunctionsWithSurvey(model);

        // Register all the custom SVG Icons
        registerSeduloSvgIcons();

        // Applying a theme mapping based on SurveyJS Variables
        model.applyTheme(lightSurveyTheme);

        model.onOpenDropdownMenu.add((_, options) => {
            options.menuType = "dropdown"
        });

        const user = {
            name: "Oliver",
            number: "07375851855"
        } // TODO: Make this a PROP or able to get this from state
        // Set Common Variables that will be needed within the survey
        model.setVariable("setUserDetails", user);

        // Set survey to read only mode depending on state of isEditing
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

        setModel(model);

    }, [surveyJson]);

    return {model};
};

export default useSurvey;
