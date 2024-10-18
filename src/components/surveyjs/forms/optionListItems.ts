export const optionListItemsJson = {
    elements: [
        {
            type: "boolean",
            name: "isActive",
            minWidth: "256px",
            title: "Active?",
            titleLocation: "top",
            description: "Is this Item active?",
            descriptionLocation: "underInput",
            defaultValue: true,
            isRequired: true,
            labelTrue: "Yes",
            labelFalse: "No",
            swapOrder: true
        },
        {
            type: "text",
            name: "sortOrder",
            title: "Sort Order",
            inputType: "number",
            isRequired: true,
            startWithNewLine: false
        },
        {
            type: "dropdown",
            name: "optionListId",
            title: "Option List",
            isRequired: true,
            choices: [
                {
                    value: "1",
                }
            ]
        },
        {
            type: "text",
            name: "value1",
            title: "Value 1",
            isRequired: true
        },
        {
            type: "text",
            name: "value2",
            title: "Value 2",
            isRequired: false
        },
        {
            type: "text",
            name: "value3",
            title: "Value 3",
            isRequired: false
        },
        {
            type: "text",
            name: "value4",
            title: "Value 4",
            isRequired: false
        },
        {
            type: "text",
            name: "value5",
            title: "Value 5",
            isRequired: false
        },
        {
            type: "text",
            name: "imageURL",
            title: "Image URL",
            isRequired: false
        },
        {
            type: "comment",
            name: "valueJson",
            title: "Value Json",
            isRequired: false,
            validators: [{
                type: "expression",
                text: "Must be valid JSON",
                expression: "validateJson({row.valueJson})"
            }],
        },


    ]
}
