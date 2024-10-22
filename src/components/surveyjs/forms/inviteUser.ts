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
                        url: `${process.env.NEXT_PUBLIC_BASE_URL}api/surveyjs/view?view=vwInviteUserCustomersList`,
                        valueName: "custId",
                        titleName: "custName"
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