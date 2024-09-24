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
                    title: "Active?",
                    titleLocation: "top",
                    description: "Is user group active?",
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
                    description: "Customer this user group belongs to",
                    descriptionLocation: "underInput",
                    choices: [
                        {
                            value: "0",
                            text: "Platform"
                        },
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
                    ],
                    defaultValue: "0"


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



                {
                    type: "checkbox",
                    name: "users",
                    title: "Select Users [BUT WE DON'T FOR TESTING ONLY]",
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

                {
                    type: "ranking",
                    name: "userId",
                    startWithNewLine: false,
                    //visibleIf: "{users.length} > 0",
                    title: "Team Members",
                    isRequired: true,
                    choicesFromQuestion: "users",
                    choicesFromQuestionMode: "selected",
                    placeholder: "Selected users",
                    readOnly: true,
                    colCount: 2

                }


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
    completeText: "Save Group",
    widthMode: "static",
    width: "1024",

    showProgressBar1: "belowheader",
    progressBarShowPageTitles1: true,
    progressBarShowPageNumbers1: true,
};