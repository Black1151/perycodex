export const emailSecureLinkJson = {
    pages: [
        {
            name: "email-secureLink-details",
            title: "Email Secure Link",
            elements: [
                {
                    type: "boolean",
                    name: "isActive",
                    minWidth: "256px",
                    title: "Active?",
                    titleLocation: "top",
                    description: "Is this email link active?",
                    descriptionLocation: "underInput",
                    defaultValue: false,
                    isRequired: true,
                    labelTrue: "Yes",
                    labelFalse: "No",
                    swapOrder: true
                },
                {
                    type: "boolean",
                    name: "adminGenerated",
                    minWidth: "256px",
                    startWithNewLine: false,
                    title: "Admin Generated?",
                    titleLocation: "top",
                    defaultValue: true,
                    isRequired: true,
                    labelTrue: "Yes",
                    labelFalse: "No",
                    swapOrder: true,
                    readOnly: true
                },
                {
                    type: "text",
                    name: "name",
                    title: "Name",
                    titleLocation: "top",
                    isRequired: false,
                    maxLength: 200,
                    placeholder: "Enter name if required",
                },

                {
                    type: "text",
                    name: "expirationDate",
                    title: "Expiration Date",
                    defaultValueExpression: "today()",
                    isRequired: true,
                    inputType: "date",
                    minValueExpression: "today()"
                },
                {
                    type: "dropdown",
                    name: "actionType",
                    title: "Action Type",
                    titleLocation: "top",
                    isRequired: true,
                    startWithNewLine: false,
                    placeholder: "Select action type",
                    choices: [
                        {
                            value: "create",
                            text: "Create"
                        },
                        {
                            value: "contribute",
                            text: "Contribute"
                        },
                        {
                            value: "direct",
                            text: "Direct"
                        },
                    ],
                },
                {
                    type: "dropdown",
                    name: "toolConfigId",
                    title: "Tool Config",
                    isRequired: true,
                    choicesByUrl: {
                        url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/toolConfig/allBy`,
                        path: "resource",
                        valueName: "id",
                        titleName: "name"
                    }
                },
                // TODO: ToolWorkflow instead
                {
                    type: "dropdown",
                    name: "workflowId",
                    title: "Workflow",
                    titleLocation: "top",
                    enableIf: "{toolConfigId} notempty",
                    visibleIf: "{toolConfigId} notempty",
                    placeholder: "Select Workflow",
                    choicesByUrl: {
                        url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/workflow/allBy?selectColumns=id,name&isActive=true`,  // The API endpoint to fetch choices from
                        path: "resource",
                        valueName: "id",
                        titleName: "name"
                    },
                },
                // TODO: WorkflowBusinessProcess instead
                {
                    type: "dropdown",
                    name: "businessProcessId",
                    title: "Business Process",
                    titleLocation: "top",
                    placeholder: "Select Business Process",
                    enableIf: "{workflowId} notempty",
                    visibleIf: "{workflowId} notempty",
                    choicesByUrl: {
                        url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/businessProcess/allBy?selectColumns=id,name&isActive=true`,
                        path: "resource",
                        valueName: "id",
                        titleName: "name"
                    },
                },
                {
                    type: "dropdown",
                    name: "toCustomerId",
                    title: "Customer",
                    choicesByUrl: {
                        url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/customer/allBy`,
                        path: "resource",
                        valueName: "id",
                        titleName: "name"
                    },
                },
                {
                    type: "dropdown",
                    name: "toUserId",
                    title: "User",
                    enableIf: "{toCustomerId} notempty",
                    visibleIf: "{toCustomerId} notempty",
                    choicesByUrl: {
                        url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/allBy?customerId={toCustomerId}`,
                        path: "resource",
                        valueName: "id",
                        titleName: "email"
                    },
                },
            ]
        }
    ],
};