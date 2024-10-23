export const workflowJson = {
    pages: [
        {
            name: "workflow-creator-admin",
            title: "Workflow Creator",
            elements: [
                {
                    type: "boolean",
                    name: "isActive",
                    title: "Is Active?",
                    labelTrue: "Yes",
                    labelFalse: "No",
                    defaultValue: true,
                    swapOrder: true,
                },
                {
                    type: "text",
                    name: "name",
                    title: "Workflow Name",
                    titleLocation: "top",
                    isRequired: true,
                    maxLength: 100,
                    placeholder: "Enter workflow name",
                },
                {
                    type: "comment",
                    name: "description",
                    title: "Description",
                    autoGrow: true,
                    placeholder: "Enter workflow description",
                },
                {
                    type: "comment",
                    name: "userAccessGroupNames",
                    title: "User Access Group Names",
                    autoGrow: true,
                    titleLocation: "top",
                    placeholder: "Enter user access group names",
                    validators: [{
                        type: "expression",
                        text: "Must be valid JSON",
                        expression: "validateJson({valueJson})"
                    }]
                },
                {
                    type: "text",
                    inputType: "date",
                    name: "startDate",
                    title: "Start Date",
                    titleLocation: "top",
                    placeholder: "Workflow Start Date",
                },

                {
                    type: "boolean",
                    name: "enableStartNewInUi",
                    title: "Enable Start New in UI",
                    isRequired: true,
                    labelTrue: "Yes",
                    labelFalse: "No",
                    defaultValue: true,
                },
                {
                    type: "boolean",
                    name: "caCanUpdateStartDate",
                    title: "Can Update Start Date",
                    labelTrue: "Yes",
                    labelFalse: "No",
                    defaultValue: false,
                },
                {
                    type: "text",
                    name: "noOfDaysLiveAfterStart",
                    startWithNewLine: false,
                    title: "Number of days live after start",
                    titleLocation: "top",
                    inputType: "number",
                    placeholder: "Number of days live after start"
                },
                {
                    type: "boolean",
                    name: "caCanUpdateDuration",
                    title: "Can Update Duration",
                    labelTrue: "Yes",
                    labelFalse: "No",
                    defaultValue: false,
                },
                {
                    type: "text",
                    name: "jsAdditionalFileUrl",
                    title: "JS Additional File URL",
                    placeholder: "Enter URL for additional JS file",
                },
                {
                    type: "text",
                    name: "cssThemeFileUrl",
                    title: "CSS Theme File URL",
                    placeholder: "Enter URL for CSS theme",
                },
                {
                    type: "text",
                    name: "sjsThemeFileUrl",
                    title: "SJS Theme File URL",
                    placeholder: "Enter URL for SJS theme",
                },

            ],
        },
    ],
};
