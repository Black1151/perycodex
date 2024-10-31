export const emailTemplateJson = {
    pages: [
        {
            name: "email-template-details",
            title: "Email Template Details",
            elements: [
                {
                    type: "boolean",
                    name: "isActive",
                    minWidth: "256px",
                    title: "Active?",
                    titleLocation: "top",
                    description: "Is this email template active?",
                    descriptionLocation: "underInput",
                    defaultValue: true,
                    isRequired: true,
                    labelTrue: "Yes",
                    labelFalse: "No",
                    swapOrder: true
                },
                {
                    type: "text",
                    name: "name",
                    title: "Name",
                    titleLocation: "top",
                    isRequired: true,
                    placeholder: "Enter name",
                    maxLength: 100

                },
                {
                    type: "comment",
                    name: "subject",
                    title: "Subject",
                    titleLocation: "top",
                    isRequired: true,
                    placeholder: "Enter email subject",
                    maxLength: 255
                },
                {
                    type: "comment",
                    name: "body",
                    title: "Paste in email body with @@placeholders@@",
                    titleLocation: "top",
                    isRequired: true,
                    autoGrow: true,
                    rows: 8
                },
                {
                    type: "comment",
                    name: "htmlFooter",
                    title: "Paste in HTML footer if required inc @@placeholders@@",
                    titleLocation: "top",
                    isRequired: false,
                    maxLength: 255,
                },
                {
                    type: "boolean",
                    name: "isReminder",
                    title: "Is this is Reminder?",
                    titleLocation: "top",
                    description: "Is this email template just a user reminder?",
                    descriptionLocation: "underInput",
                    defaultValue: true,
                    isRequired: true,
                    labelTrue: "Yes",
                    labelFalse: "No",
                    swapOrder: true
                },
                {
                    type: "boolean",
                    name: "isActionable",
                    title: "Is this Actionable?",
                    titleLocation: "top",
                    description: "Is this email template inclusive of an Action link?",
                    descriptionLocation: "underInput",
                    defaultValue: true,
                    isRequired: true,
                    labelTrue: "Yes",
                    labelFalse: "No",
                    swapOrder: true
                },
                {
                    type: "dropdown",
                    name: "actionType",
                    title: "Action Type",
                    titleLocation: "top",
                    isRequired: true,
                    choices: [
                        {
                            value: "create",
                            text: "Create"
                        },
                        {
                            value: "contribute",
                            text: "Contribute"
                        }
                    ],
                    placeholder: "Select action type",
                    visibleIf: "{isActionable} = 'True'"
                },
                {
                    type: "text",
                    name: "actionUrl",
                    title: "Action URL (Link)",
                    titleLocation: "top",
                    isRequired: true,
                    placeholder: "Enter action URL (Link)",
                    maxLength: 300,
                    visibleIf: "{isActionable} = 'True'"
                }
            ]
        }
    ],
};