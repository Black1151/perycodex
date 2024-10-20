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
                    type: "boolean",
                    name: "enableStartNewInUi",
                    title: "Enable Start New in UI",
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
