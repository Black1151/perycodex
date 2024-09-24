export const siteJson = {

    pages: [

        {
            name: "customer-address-site",
            title: "Site Details",
            elements: [
                {
                    type: "boolean",
                    name: "isActive",
                    minWidth: "256px",
                    title: "Active?",
                    titleLocation: "top",
                    description: "Is this site active?",
                    descriptionLocation: "underInput",
                    defaultValue: true,
                    isRequired: true,
                    labelTrue: "Yes",
                    labelFalse: "No",
                    swapOrder: true
                },

                {
                    type: "text",
                    name: "siteName",
                    width: "64%",
                    minWidth: "192px",
                    title: "Site Name",
                    titleLocation: "top",
                    isRequired: true,
                    placeholder: "Enter site Name"
                },

                {
                    type: "dropdown",
                    name: "siteTypeId",
                    startWithNewLine: false,
                    title: "Site Type",
                    titleLocation: "top",
                    description: "What type of site is this?",
                    descriptionLocation: "underInput",
                    isRequired: true,
                    renderAs1: "select",
                    choices: [
                        {
                            value: "1",
                            text: "Office"
                        },
                        {
                            value: "2",
                            text: "Head Office"
                        },
                        {
                            value: "3",
                            text: "Warehouse"
                        },
                        {
                            value: "4",
                            text: "Distribution Centre"
                        },
                        {
                            value: "5",
                            text: "Other"
                        }
                    ],
                    placeholder: "Select Site Type",
                    allowClear: false,
                    defaultValue: "1"
                },

                {
                    type: "text",
                    name: "address1",
                    minWidth: "256px",
                    titleLocation: "hidden",
                    isRequired: true,
                    placeholder: "No. / Name & Street"
                },
                {
                    type: "text",
                    name: "address2",
                    minWidth: "256px",
                    startWithNewLine: false,
                    titleLocation: "hidden",
                    isRequired: false,
                    placeholder: "Area"
                },
                {
                    type: "text",
                    name: "address3",
                    minWidth: "256px",
                    titleLocation: "hidden",
                    isRequired: true,
                    placeholder: "Town / City"
                },
                {
                    type: "text",
                    name: "address4",
                    minWidth: "256px",
                    startWithNewLine: false,
                    titleLocation: "hidden",
                    isRequired: true,
                    placeholder: "Region"
                },
                {
                    type: "text",
                    name: "postcode",
                    minWidth: "256px",
                    titleLocation: "hidden",
                    isRequired: true,
                    placeholder: "Postcode"
                },
                {
                    type: "dropdown",
                    name: "country",
                    minWidth: "256px",
                    startWithNewLine: false,
                    titleLocation: "hidden",
                    isRequired: true,
                    choicesByUrl: {
                        url: "http://surveyjs.io/api/CountriesExample?region=Europe",
                        valueName: "cca2",
                        titleName: "name"
                    },
                    placeholder: "Country",
                    allowClear: false,
                    defaultValue: "GB",
                    choicesOrder: "asc"
                },

                {
                    type: "text",
                    name: "latitude",
                    minWidth: "256px",
                    title: "Latitude",
                    titleLocation: "top",
                    isRequired: true,
                    readOnly: true,
                    inputType: "number",
                    placeholder: "Latitude"
                },
                {
                    type: "text",
                    name: "longitude",
                    minWidth: "256px",
                    startWithNewLine: false,
                    title: "Longitude",
                    titleLocation: "top",
                    isRequired: true,
                    readOnly: true,
                    inputType: "number",
                    placeholder: "Longitude"
                }

            ]
        },
        {
            name: "sitecontact-details-section",
            title: "Contact Details",
            elements: [


                {
                    type: "dropdown",
                    name: "primaryContactId",
                    minWidth: "256px",
                    title: "Primary Contact (Site)",
                    titleLocation: "top",
                    description: "Select the primary contact at this site",
                    descriptionLocation: "underInput",
                    isRequired: true,

                    choices: [
                        {
                            value: "1",
                            text: "User1"
                        },
                        {
                            value: "2",
                            text: "User2"
                        },
                        {
                            value: "3",
                            text: "User3"
                        }
                    ],
                    placeholder: "Select primary contact at this site / office",
                    allowClear: false
                },

                {
                    type: "text",
                    name: "siteTel",
                    width: "64%",
                    minWidth: "192px",
                    title: "Site Tel.",
                    titleLocation: "top",
                    isRequired: true,
                    inputType: "tel",
                    maskType: "pattern",
                    maskSettings: {
                        pattern: "9999 9999999"
                    },
                    placeholder: "Enter site telephone"
                },
                {
                    type: "text",
                    name: "siteEmail",
                    width: "64%",
                    minWidth: "192px",
                    title: "Site Email",
                    titleLocation: "top",
                    isRequired: true,
                    inputType: "email",
                    placeholder: "Enter site email"
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
    completeText: "Save Site",
    widthMode: "static",
    width: "900",

    showProgressBar: "belowheader",
    progressBarShowPageTitles: true,
    progressBarShowPageNumbers: true,
};