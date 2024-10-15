export const inviteUserJson = {
    pages: [
        {
            name: "invite-user-details",
            title: "Invite User",
            elements: [
                {
                    type: "dropdown",
                    name: "customerId",
                    isRequired: true,
                    title: "Customer",
                    choicesByUrl: {
                        url: `${process.env.NEXT_PUBLIC_BASE_URL}api/customer/allBy?parentId=null`,
                        path: "resource",
                        valueName: "id",
                        titleName: "name"
                    },
                },
                {
                    type: "text",
                    name: "email",
                    inputType: "email",
                    title: "Email",
                    titleLocation: "top",
                    isRequired: true,
                    placeholder: "Enter the email of the user"
                },
            ]
        }
    ],
};