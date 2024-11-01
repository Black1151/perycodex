export const emailSecureLinkJson = {
    pages: [
        {
            name: "email-schedule-details",
            title: "Email Schedule Details",
            elements: [
                {
                    type: "boolean",
                    name: "isActive",
                    minWidth: "256px",
                    title: "Active?",
                    titleLocation: "top",
                    description: "Is this email schedule active?",
                    descriptionLocation: "underInput",
                    defaultValue: false,
                    isRequired: true,
                    labelTrue: "Yes",
                    labelFalse: "No",
                    swapOrder: true
                },
                {
                    type: "text",
                    name: "name",
                    title: "Schedule Name",
                    titleLocation: "top",
                    isRequired: true,
                    placeholder: "Enter schedule name",
                },
                {
                    type: "dropdown",
                    name: "workflowId",
                    title: "Workflow",
                    titleLocation: "top",
                    placeholder: "Select Workflow",
                    isRequired: true,
                    choicesByUrl: {
                        url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/workflow/allBy?selectColumns=id,name&isActive=true`,  // The API endpoint to fetch choices from
                        path: "resource",
                        valueName: "id",
                        titleName: "name"
                    },
                },
                {
                    type: "dropdown",
                    name: "businessProcessId",
                    title: "Business Process",
                    titleLocation: "top",
                    isRequired: true,
                    placeholder: "Select Business Process",
                    choicesByUrl: {
                        url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/businessProcess/allBy?selectColumns=id,name&isActive=true`,
                        path: "resource",
                        valueName: "id",
                        titleName: "name"
                    },
                },
                {
                    type: "dropdown",
                    name: "emailTemplateId",
                    title: "Email Template",
                    titleLocation: "top",
                    isRequired: true,
                    placeholder: "Select Email Template",
                    choicesByUrl: {
                        url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/emailTemplate/allBy?selectColumns=id,name&isActive=true`,
                        path: "resource",
                        valueName: "id",
                        titleName: "name"
                    },
                },
                {
                    type: "text",
                    name: "startDate",
                    title: "Select start date",
                    defaultValueExpression: "today()",
                    isRequired: true,
                    inputType: "date",
                    minValueExpression: "today()"
                },
                {
                    type: "text",
                    name: "endDate",
                    title: "Select end date",
                    defaultValueExpression: "{startDate}",
                    isRequired: true,
                    inputType: "date",
                    minValueExpression: "{startDate}"
                }, {
                    type: "text",
                    name: "sendTime",
                    title: "Send Time between 09:00 and 18:00",
                    isRequired: true,
                    inputType: "time",
                    min: "09:00",
                    max: "18:00"
                },
                {
                    type: "comment",
                    name: "targetCondition",
                    title: "Additional Condition that needs to be met",
                    titleLocation: "top",
                    visible: false,
                    isRequired: false,
                    placeholder: "Enter target condition",
                    autoGrow: true
                },
                {
                    type: "dropdown",
                    name: "frequency",
                    title: "Frequency",
                    titleLocation: "top",
                    isRequired: true,
                    placeholder: "Select frequency",
                    choices: [
                        {
                            value: "daily",
                            text: "Daily"
                        },
                        {
                            value: "weekly",
                            text: "Weekly"
                        },
                        {
                            value: "monthly",
                            text: "Monthly"
                        },
                        {
                            value: "one-time",
                            text: "One-time"
                        }],

                },
                {
                    type: "checkbox",
                    name: "daysOfWeek",
                    title: "Which days of week?",
                    isRequired: true,
                    visibleIf: "{frequency} = 'Weekly'",
                    choices: [
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday"
                    ],
                },
                {
                    type: "checkbox",
                    name: "daysOfMonth",
                    title: "Which days of month?",
                    requiredIf: "{lastDayOfMOnth} = false",
                    visibleIf: "{frequency} = 'Monthly'",
                    colCount: 5,
                    choices: [
                        "1", "2", "3", "4", "5", "6", "7",
                        "8", "9", "10", "11", "12", "13", "14",
                        "15", "16", "17", "18", "19", "20", "21",
                        "22", "23", "24", "25", "26", "27", "28"],
                },
                {
                    type: "boolean",
                    name: "lastDayOfMonth",
                    minWidth: "256px",
                    title: "Last day of month",
                    titleLocation: "top", defaultValue: false,
                    isRequired: true,
                    labelTrue: "Yes",
                    labelFalse: "No",
                    swapOrder: true,
                    visibleIf: "{frequency} = 'Monthly'",
                }, {
                    type: "text",
                    name: "interval",
                    title: "Enter an Interval",
                    isRequired: true,
                    inputType: "number",
                    defaultValue: 1,
                    min: 1,
                    max: 30,
                    description: "An interval of 1 would be every week or month, 2 would be every 2 weeks or months etc.",
                    descriptionLocation: "underInput",
                },
                {
                    type: "tagbox",
                    name: "userDistGroupNames",
                    title: "User Distribution Group Names",
                    titleLocation: "top",
                    placeholder: "Enter user access group names",
                    choicesByUrl: {
                        url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/userGroupPlatform`,
                        path: "resource",
                        valueName: "name",
                        titleName: "name"
                    },
                },
            ]
        }
    ],
};