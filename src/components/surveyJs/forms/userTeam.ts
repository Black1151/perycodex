export const userTeamJson = {
    pages: [
        {
            name: "user-team-details",
            title: "Team",
            elements: [
                {
                    type: "boolean",
                    name: "isActive",
                    minWidth: "256px",
                    title: "Active?",
                    titleLocation: "top",
                    description: "Is team active?",
                    descriptionLocation: "underInput",
                    defaultValue: false,
                    isRequired: true,
                    labelTrue: "Yes",
                    labelFalse: "No",
                    swapOrder: true,
                    readOnly: false
                },
                {
                    type: "dropdown",
                    name: "customerId",
                    title: "Customer",
                    titleLocation: "top",
                    placeholder: "Select Customer",
                    isRequired: true,
                    description: "Customer this team belongs to",
                    descriptionLocation: "underInput",
                    // TODO: Update to customers
                    choices: [
                        {
                            value: "1",
                            text: "Customer 1"
                        },
                        {
                            value: "2",
                            text: "Customer 2"
                        },
                        {
                            value: "3",
                            text: "Customer 3"
                        },
                        {
                            value: "4",
                            text: "Customer 4"
                        }
                    ]
                },
                {
                    type: "text",
                    name: "name",
                    title: "Team Name",
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
                // TODO: Rocco to figure out Team vs Department
                {
                    type: "dropdown",
                    name: "parentTeamId",
                    title: "Parent Team",
                    titleLocation: "top",
                    placeholder: "Select Team",
                    isRequired: true,
                    description: "Parent of this team, normally a department, service or division.",
                    descriptionLocation: "underInput",
                    // TODO: Pulls from userTeam APIallBy
                    choices: [
                        {
                            value: "1",
                            text: "Dept 1"
                        },
                        {
                            value: "2",
                            text: "Dept 2"
                        },
                        {
                            value: "3",
                            text: "Dept 3"
                        },
                        {
                            value: "4",
                            text: "Dept 4"
                        }
                    ]


                },
                {
                    type: "dropdown",
                    name: "managerId",
                    title: "Manager",
                    titleLocation: "top",
                    placeholder: "Select Manager",
                    isRequired: true,
                    description: "Manager of this team",
                    descriptionLocation: "underInput",
                    // TODO: Pulls from Users
                    choices: [
                        {
                            value: "1",
                            text: "User 1"
                        },
                        {
                            value: "2",
                            text: "User 2"
                        },
                        {
                            value: "3",
                            text: "User 3"
                        },
                        {
                            value: "4",
                            text: "User 4"
                        }
                    ]


                },
                // TODO: Could be a separate component after the team is created
                {
                    type: "checkbox",
                    name: "users",
                    title: "Select Users [BUT WE WILL USE A GRID - THIS IS FOR TESTING ONLY]",
                    titleLocation: "top",
                    isRequired: true,
                    choices: [
                        {
                            value: "1",
                            text: "User 1"
                        },
                        {
                            value: "2",
                            text: "User 2"
                        },
                        {
                            value: "3",
                            text: "User 3"
                        },
                        {
                            value: "4",
                            text: "User 4"
                        },
                        {
                            value: "5",
                            text: "User 5"
                        },
                        {
                            value: "6",
                            text: "User 6"
                        },
                        {
                            value: "7",
                            text: "User 7"
                        },
                        {
                            value: "8",
                            text: "User 8"
                        }
                    ],
                    placeholder: "Select 1+ users",
                    colCount: 2
                },
            ]
        }
    ],
    showPrevButton: true,
    showTOC: false,
    showTitle: true,
    showCompletedPage: false,
    checkErrorsMode: "onValueChanged",
    showQuestionNumbers: "off",
    questionErrorLocation: "bottom",
    completeText: "Save Team",
    widthMode: "static",
    width: "1024",
    showProgressBar1: "belowheader",
    progressBarShowPageTitles1: true,
    progressBarShowPageNumbers1: true,
};