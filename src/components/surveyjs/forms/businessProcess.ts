export const businessProcessJson = {
    pages: [
        {
            name: "basic-details",
            title: "Basic Details",
            elements: [
                {
                    type: "text",
                    name: "name",
                    title: "Business Process Name",
                    titleLocation: "top",
                    isRequired: true,
                    placeholder: "Enter business process name",
                },
                {
                    type: "boolean",
                    name: "isActive",
                    title: "Is Active?",
                    labelTrue: "Yes",
                    labelFalse: "No",
                    defaultValue: true,
                    startWithNewLine: false
                },
                {
                    type: "comment",
                    name: "description",
                    title: "Description",
                    isRequired: true,
                    autoGrow: true,
                    placeholder: "Enter description",
                },
                {
                    type: "dropdown",
                    name: "formId",
                    isRequired: true,
                    title: "Survey JS Form",
                    choicesByUrl: {
                        url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/form/allBy`,
                        path: "resource",
                        valueName: "id",
                        titleName: "name"
                    },
                },
                {
                    type: "tagbox",
                    name: "userAccessGroupNames",
                    title: "User Access Group Names",
                    titleLocation: "top",
                    placeholder: "Enter user access group names",
                    choicesByUrl: {
                        url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/userGroupPlatform`,
                        path: "resource",
                        valueName: "name",
                        titleName: "name"
                    },
                },
                {
                    type: "boolean",
                    name: "allowAlwaysEdit",
                    title: "Always Editable (allowAlwaysEdit)",
                    labelTrue: "Yes",
                    labelFalse: "No",
                    isRequired: true,
                    defaultValue: false,
                },
                {
                    type: "boolean",
                    name: "allowBpStartersViewAll",
                    title: "BP Starters Can View All (allowBpStartersViewAll)",
                    labelTrue: "Yes",
                    labelFalse: "No",
                    defaultValue: false,
                    isRequired: true,
                    startWithNewLine: false,
                },
                {
                    type: "boolean",
                    name: "allowElevatedViewAll",
                    title: "Elevated Users Can View All (allowElevatedViewAll)",
                    labelTrue: "Yes",
                    labelFalse: "No",
                    isRequired: true,
                    defaultValue: false,
                },
                {
                    type: "boolean",
                    name: "startByDefault",
                    title: "Start By Default (startByDefault)",
                    labelTrue: "Yes",
                    labelFalse: "No",
                    isRequired: true,
                    defaultValue: true,
                    startWithNewLine: false,
                },
                {
                    type: "text",
                    name: "startDate",
                    title: "Start Date",
                    inputType: "date",
                    placeholder: "Enter start date",
                },
                {
                    type: "text",
                    name: "bpStartTriggerGv",
                    title: "BP Start Global Value",
                    placeholder: "Enter trigger by information",
                },
                {
                    type: "text",
                    name: "bpStartTriggerOperator",
                    title: "BP Start Trigger Operator",
                    placeholder: "Enter trigger operator",
                    startWithNewLine: false
                },
                {
                    type: "text",
                    name: "bpStartTriggerValue",
                    title: "BP Start Trigger Value",
                    placeholder: "Enter trigger value",
                    startWithNewLine: false
                },
                {
                    type: "text",
                    inputType: "number",
                    name: "noOfDaysLiveAfterBpStart",
                    title: "Days Live After BP Start",
                },
                {
                    type: "text",
                    inputType: "number",
                    name: "noOfDaysLiveAfterWfStart",
                    title: "Days Live After WF Start",
                },
                {
                    type: "boolean",
                    name: "caCanUpdateDurationParams",
                    title: "Allow CA to Update Duration",
                    labelTrue: "Yes",
                    labelFalse: "No",
                    defaultValue: false,
                },
                {
                    type: "comment",
                    autoGrow: true,
                    name: "globalVariables",
                    title: "Global Variables",
                    placeholder: "JSON of global variables",
                },
                {
                    type: "comment",
                    autoGrow: true,
                    name: "notificationTriggers",
                    title: "Notification Triggers",
                    placeholder: "JSON of notification triggers",
                },

                {
                    type: "boolean",
                    name: "saveAllowed",
                    title: "Is Save Allowed?",
                    labelTrue: "Yes",
                    labelFalse: "No",
                    defaultValue: false,
                },

            ],
        },
        {
            name: "contributor-functionality",
            title: "Contributors",
            elements: [
                {
                    type: "boolean",
                    name: "contributorFunctionality",
                    title: "Enable Contributor Functionality",
                    labelTrue: "Yes",
                    labelFalse: "No",
                    defaultValue: false,
                },
                {
                    type: "comment",
                    name: "contributorReason",
                    visibleIf: "{contributorFunctionality}",
                    title: "Reason for Contributor",
                    isRequired: true,
                    autoGrow: true,
                    placeholder: "Enter description",
                },
                {
                    type: "text",
                    name: "minRequired",
                    visibleIf: "{contributorFunctionality}",
                    title: "# Minimum Required?",
                    inputType: "number",
                },
                {
                    type: "text",
                    inputType: "number",
                    name: "maxRequired",
                    visibleIf: "{contributorFunctionality}",
                    title: "# Minimum Required?",
                    startWithNewLine: false
                },
                {
                    type: "comment",
                    name: "altContributorTerm",
                    title: "Action Contributor Term",
                    placeholder: "Enter action contributor term",
                },
            ]
        },
        {
            name: "images-locations",
            title: "Images",
            elements: [
                {
                    type: "text",
                    name: "smallIconImageUrl",
                    title: "Small Icon Image URL",
                    placeholder: "Enter small icon image URL",
                },
                {
                    type: "text",
                    name: "largeIconImageUrl",
                    title: "Large Icon Image URL",
                    placeholder: "Enter large icon image URL",
                },
            ]
        }
    ],
};
