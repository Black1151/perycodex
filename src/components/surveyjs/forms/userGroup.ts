export const userGroupJson = {
    pages: [
        {
            name: "user-group-details",
            title: "User Group",
            elements: [
                {
                    type: "boolean",
                    name: "isActive",
                    minWidth: "256px",
                    title: "Is user group active?",
                    titleLocation: "top",
                    defaultValue: true,
                    isRequired: true,
                    labelTrue: "Yes",
                    labelFalse: "No",
                    swapOrder: true,
                    readOnly: false
                },
                {
                    type: "dropdown",
                    name: "customerId",
                    isRequired: true,
                    title: "Customer",
                    visibleIf: "{pgv_currentUser.role} != 'PA'",
                    enableIf: "{pgv_currentUser.role} != 'PA'",
                    choicesByUrl: {
                        url: `${process.env.NEXT_PUBLIC_BASE_URL}api/customer/allBy`,
                        path: "resource",
                        valueName: "id",
                        titleName: "name"
                    },
                },
                {
                    type: "text",
                    name: "name",
                    title: "User Group Name",
                    titleLocation: "top",
                    isRequired: true,
                    maxLength: 200,
                    placeholder: "Enter name",
                    readOnly: false
                },
                {
                    type: "comment",
                    name: "description",
                    title: "Description",
                    titleLocation: "top",
                    isRequired: true,
                    maxLength: 300,
                    placeholder: "Enter description",
                    readOnly: false
                },
            ]
        }
    ],
};