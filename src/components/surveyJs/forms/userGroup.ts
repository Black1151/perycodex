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
                // TODO: Different component for add people to Groups like Teams/Departments
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