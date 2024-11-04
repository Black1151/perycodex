export const duplicateCustomerEmailSchedule = {
    pages: [
        {
            name: "duplicate-customer-schedule-details",
            title: "Duplicate Schedule",
            elements: [
                {
                    type: "text",
                    name: "scheduleId",
                    readOnly: true,
                    isRequired: true,
                    title: "Schedule ID",
                },
                {
                    type: "dropdown",
                    name: "customerId",
                    isRequired: true,
                    title: "Customer",
                    choicesByUrl: {
                        url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/surveyjs/view?view=vwInviteUserCustomersList`,
                        valueName: "custId",
                        titleName: "custName"
                    },
                },

            ]
        }
    ],
};