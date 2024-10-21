export const inviteUserJson = {
    pages: [
        {
            name: "invite-user-details",
            title: "Invite User",
            elements: [
                // TODO: Change this to use view that checks if customer has a domain
                {
                    type: "dropdown",
                    name: "customerId",
                    isRequired: true,
                    title: "Customer",
                    choicesByUrl: {
                        url: `${process.env.NEXT_PUBLIC_BASE_URL}api/customer/allBy?parentId=null&isActive=true`,
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