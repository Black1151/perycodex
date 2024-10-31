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
                    type: "dropdown",
                    name: "worklfowId",
                    title: "Workflow",
                    titleLocation: "top",
                    isRequired: true,
                    choices: [
                        {
                            value: "1",
                            text: "Workflow 1"
                        },
                        {
                            value: "2",
                            text: "Workflow 2"
                        },
                        {
                            value: "2",
                            text: "Workflow 3"
                        },
                        {
                            value: "2",
                            text: "Workflow 4"
                        }],
                    placeholder: "Select workflow"
                },
                {
                    type: "dropdown",
                    name: "businessProcessId",
                    title: "Stage",
                    titleLocation: "top",
                    isRequired: false,
                    choices: [
                        {
                            value: "1",
                            text: "Stage 1"
                        },
                        {
                            value: "2",
                            text: "Stage 2"
                        },
                        {
                            value: "2",
                            text: "Stage 3"
                        },
                        {
                            value: "2",
                            text: "Stage 4"
                        }],
                    placeholder: "Select stage"
                },
                {
                    type: "dropdown",
                    name: "emailTemaplateId",
                    title: "Email Template",
                    titleLocation: "top",
                    isRequired: true,
                    choices: [
                        {
                            value: "1",
                            text: "Email Template 1"
                        },
                        {
                            value: "2",
                            text: "Email Template 2"
                        },
                        {
                            value: "2",
                            text: "Email Template 3"
                        },
                        {
                            value: "2",
                            text: "Email Template 4"
                        }],
                    placeholder: "Select email template"
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
                    placeholder: "Select frequency"
                },
                {
                    type: "checkbox",
                    name: "daysOfWeek",
                    title: "Which days of week?",
                    isRequired: true,
                    choices: [
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday"
                    ],
                    visibleIf: "{frequency} = 'Weekly'"
                },
                {
                    type: "checkbox",
                    name: "daysOfMonth",
                    title: "Which days of month?", requiredIf: "{lastDayOfMOnth} = false",
                    choices: [
                        "1", "2", "3", "4", "5", "6", "7",
                        "8", "9", "10", "11", "12", "13", "14",
                        "15", "16", "17", "18", "19", "20", "21",
                        "22", "23", "24", "25", "26", "27", "28"], visibleIf: "{frequency} = 'Monthly'", colCount: 5
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
                }, {
                    type: "matrixdynamic",
                    name: "userDistGroupNames",
                    state: "collapsed",
                    startWithNewLine: true,
                    title: "Distribution User Group Names",
                    showHeader: false,
                    description: "Which groups of user is this email sent to?",
                    descriptionLocation: "underInput",
                    columns: [
                        {
                            name: "userGroup",
                            title: "User Group Name",
                            cellType: "text",
                            isRequired: true,
                            maxLength: 80,
                            placeholder: "Enter group name"
                        }
                    ],
                    rowCount: 1,
                    confirmDelete: true,
                    confirmDeleteText: "Are you sure you want to delete this user group?",
                    addRowText: "Add a User Group Name",
                    removeRowText: "Delete this User Group Name",
                    hideColumnsIfEmpty: true,
                    emptyRowsText: "No user group names entered yet.\nClick 'Add a User Group Name' to add a new one.\nClick the delete icon to remove an existing entry."
                }
            ]
        }
    ],
};