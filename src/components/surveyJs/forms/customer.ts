export const customerJson = {
    pages: [
        {
            name: "customer-info",
            title: "Customer Info",
            elements: [
                {
                    type: "boolean",
                    name: "isActive",
                    minWidth: "256px",
                    title: "Active?",
                    titleLocation: "top",
                    description: "Is this customer active?",
                    descriptionLocation: "underInput",
                    defaultValue: false,
                    isRequired: true,
                    labelTrue: "Yes",
                    labelFalse: "No",
                    swapOrder: true
                },
                {
                    type: "text",
                    name: "name",
                    width: "66%",
                    title: "Customer Name",
                    titleLocation: "top",
                    description: "Enter the name of the customer",
                    descriptionLocation: "underInput",
                    isRequired: true,
                    placeholder: "Name"
                },




                {
                    type: "text",
                    name: "webAddress",
                    width: "36%",
                    minWidth: "256px",
                    title: "Web Address",
                    titleLocation: "top",
                    description: "Enter the web address of the client's website",
                    descriptionLocation: "underInput",
                    inputType: "url",
                    placeholder: "Web Address"
                },




                {
                    type: "dropdown",
                    name: "businessTypeId",
                    width: "64%",
                    minWidth: "192px",
                    title: "Business Type",
                    titleLocation: "top",
                    description: "What type of business is this?",
                    descriptionLocation: "underInput",
                    isRequired: true,
                    "renderAs": "select",
                    choices: [
                        {
                            value: "1",
                            text: "Limited Company"
                        },
                        {
                            value: "2",
                            text: "Private Individual"
                        },
                        {
                            value: "3",
                            text: "Sole Trader"
                        },
                        {
                            value: "4",
                            text: "Charity"
                        },
                        {
                            value: "5",
                            text: "Partnership"
                        }
                    ],
                    placeholder: "Select Business Type",
                    allowClear: false
                },
                {
                    type: "text",
                    name: "companyNo",
                    visibleIf: "{businessTypeId} = 1",
                    minWidth: "256px",
                    title: "Company Number",
                    titleLocation: "top",
                    description: "In accordance with Companies House.",
                    descriptionLocation: "underInput",
                    isRequired: true,
                    requiredErrorText: "Company No. must be a 9-digit number.",
                    validators: [
                        {
                            type: "regex",
                            text: "Company No. must be a 9-digit number.",
                            regex: "^(?!0{3})(?!6{3})[0-8]\\d{2}-?(?!0{2})\\d{2}-?(?!0{4})\\d{4}$"
                        }
                    ],
                    maxLength: 9,
                    placeholder: "Company Number"
                },
                {
                    type: "text",
                    name: "sicCode",
                    visibleIf: "{businessTypeId} = 1",
                    minWidth: "256px",
                    startWithNewLine: false,
                    title: "SIC Code",
                    titleLocation: "top",
                    description: "Enter business SIC Code.",
                    descriptionLocation: "underInput",
                    isRequired: true,
                    requiredErrorText: "The SIC code must be a 5-digit number.",
                    validators: [
                        {
                            type: "regex",
                            text: "The SIC code must be a 5-digit number.",
                            regex: "^(?!0{3})(?!6{3})[0-8]\\d{2}-?(?!0{2})\\d{2}-?$"
                        }
                    ],
                    maxLength: 5,
                    placeholder: "SIC Code"
                },


                {
                    type: "dropdown",
                    name: "multiSite",
                    width: "64%",
                    minWidth: "192px",
                    title: "Single or Multiple Sites",
                    titleLocation: "top",
                    description: "Select if this a single or multiple site business.",
                    descriptionLocation: "underInput",
                    isRequired: true,
                    searchEnabled: false,
                    choices: [
                        {
                            value: "1",
                            text: "Single"
                        },
                        {
                            value: "2",
                            text: "Multiple"
                        }

                    ],
                    placeholder: "Select",
                    defaultValue: "1",
                    allowClear: false
                },


            ]
        },
        {
            name: "customer-business-details",
            title: "Business Details",
            elements: [

                {
                    type: "dropdown",
                    name: "sectorId",
                    width: "64%",
                    minWidth: "192px",
                    title: "Sector",
                    titleLocation: "top",
                    description: "Select the primary sector in which this business operates",
                    descriptionLocation: "underInput",
                    isRequired: true,
                    "renderA": "select",
                    choices: [
                        {
                            value: "1",
                            text: "Retail & Wholesale"
                        },
                        {
                            value: "2",
                            text: "Transport & Storage"
                        },
                        {
                            value: "3",
                            text: "Accommodation & Food"
                        },
                        {
                            value: "4",
                            text: "IT & Communications"
                        },
                        {
                            value: "5",
                            text: "Finance & Insurance"
                        },
                        {
                            value: "6",
                            text: "Real Estate"
                        },
                        {
                            value: "7",
                            text: "Professional & Technical"
                        },
                        {
                            value: "8",
                            text: "Business Administration & Support"
                        },
                        {
                            value: "9",
                            text: "Public Administration & Defence"
                        },
                        {
                            value: "10",
                            text: "Education"
                        },
                        {
                            value: "11",
                            text: "Health & Social Care"
                        },
                        {
                            value: "12",
                            text: "Charity"
                        },
                        {
                            value: "13",
                            text: "Arts, Entertainment & Recreation"
                        },
                        {
                            value: "14",
                            text: "Agriculture, Forestry & Fishing"
                        },
                        {
                            value: "15",
                            text: "Mining & Extractives"
                        },
                        {
                            value: "16",
                            text: "Manufacturing"
                        },
                        {
                            value: "17",
                            text: "Construction"
                        },
                        {
                            value: "18",
                            text: "Utilities"
                        },
                        {
                            value: "19",
                            text: "Other"
                        }
                    ],
                    placeholder: "Select Sector",
                    allowClear: false
                },
                {
                    type: "dropdown",
                    name: "regionId",
                    width: "64%",
                    minWidth: "192px",
                    title: "Region",
                    titleLocation: "top",
                    description: "Select the region in which this business operates.",
                    descriptionLocation: "underInput",
                    isRequired: true,
                    searchEnabled: false,
                    choices: [
                        {
                            value: "1",
                            text: "UK"
                        },
                        {
                            value: "2",
                            text: "EU Wide"
                        },
                        {
                            value: "3",
                            text: "EMEA Region"
                        },
                        {
                            value: "4",
                            text: "World Wide"
                        }
                    ],
                    placeholder: "Select Region",
                    allowClear: false
                },
                {
                    type: "dropdown",
                    name: "companySizeId",
                    minWidth: "256px",
                    title: "Company Size",
                    titleLocation: "top",
                    description: "Select the company size.",
                    descriptionLocation: "underInput",
                    isRequired: true,
                    choices: [
                        {
                            value: "1",
                            text: "Micro (1 - 10 Employees)"
                        },
                        {
                            value: "2",
                            text: "Small (11 - 50 Employees)"
                        },
                        {
                            value: "3",
                            text: "Medium (51 - 250 Employees)"
                        },
                        {
                            value: "4",
                            text: "Large (251+ Employees)"
                        }
                    ],
                    placeholder: "Select Company Size",
                    allowClear: false
                },
                {
                    type: "text",
                    name: "numberOfEmployees",
                    minWidth: "256px",
                    startWithNewLine: false,
                    title: "Number of Employees",
                    titleLocation: "top",
                    description: "Enter the number of current employees.",
                    descriptionLocation: "underInput",
                    isRequired: true,
                    inputType: "number",
                    min: 1,
                    step: 1,
                    validators: [
                        {
                            type: "expression",
                            text: "Not within the selected Company Size employee range",
                            expression: "({companySizeId} = 1 and {numberOfEmployees} <= 10) or ({companySizeId} = 2 and {numberOfEmployees} > 10 and {numberOfEmployees} <= 50) or ({companySizeId} = 3 and {numberOfEmployees} > 51 and {numberOfEmployees} <= 250) or ({companySizeId} = 4 and {numberOfEmployees} > 250)"
                        }
                    ],
                    placeholder: "Number of Employees"
                },

            ]
        },
        {
            name: "customer-settings",
            title: "Settings",
            elements: [


                {
                    type: "text",
                    name: "customerCode",
                    width: "64%",
                    minWidth: "192px",
                    title: "Customer Code",
                    titleLocation: "top",
                    description: "Enter a customer code for internal reference",
                    descriptionLocation: "underInput",
                    isRequired: true,
                    placeholder: "Customer Code"
                },

                {
                    type: "matrixdynamic",
                    name: "domains",
                    title: "Add Domains",
                    columns: [
                        {
                            name: "domain",
                            title: "Domain",
                            cellType: "text",
                            isRequired: true,
                            maxLength: 80,
                            placeholder: "Enter domain",
                        }

                    ],

                    rowCount: 0,
                    confirmDelete: true,
                    confirmDeleteText: "Are you sure you want to delete this domain?",
                    addRowText: "Add a Domain",
                    removeRowText: "Delete this Domain",
                    hideColumnsIfEmpty: true,
                    emptyRowsText: "No domains entered yet.\nClick 'Add a Domain' to add a new one.\nClick the delete icon to remove an existing entry."
                }

            ]
        },
        {
            name: "customer-address-site",
            title: "Business Primary Location",
            elements: [


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
                    isRequired: true,
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
                    type: "panel",
                    name: "primarySite",
                    visibleIf: "{address1} notempty and {address2} notempty and {address3} notempty and {address4} notempty and {country} notempty and {postcode} notempty",
                    title: "Primary Location Details",
                    isRequired: true,
                    elements: [
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
                            type: "text",
                            name: "siteAddress1",
                            minWidth: "256px",
                            title: "No. / Name & Street",
                            titleLocation: "top",
                            defaultValueExpression: "{address1}",
                            isRequired: true,
                            readOnly: true,
                            placeholder: "No. / Name & Street"
                        },
                        {
                            type: "text",
                            name: "siteAddress2",
                            minWidth: "256px",
                            startWithNewLine: false,
                            title: "Area",
                            titleLocation: "top",
                            defaultValueExpression: "{address2}",
                            isRequired: true,
                            readOnly: true,
                            placeholder: "Area"
                        },
                        {
                            type: "text",
                            name: "siteAddress3",
                            minWidth: "256px",
                            title: "Town / City",
                            titleLocation: "top",
                            defaultValueExpression: "{address3}",
                            isRequired: true,
                            readOnly: true,
                            placeholder: "Town / City"
                        },
                        {
                            type: "text",
                            name: "siteAddress4",
                            minWidth: "256px",
                            startWithNewLine: false,
                            title: "Region",
                            titleLocation: "top",
                            defaultValueExpression: "{address4}",
                            isRequired: true,
                            readOnly: true,
                            placeholder: "Region"
                        },
                        {
                            type: "text",
                            name: "sitePostcode",
                            minWidth: "256px",
                            title: "Postcode",
                            titleLocation: "top",
                            defaultValueExpression: "{postcode}",
                            isRequired: true,
                            readOnly: true,
                            placeholder: "Postcode"
                        },
                        {
                            type: "dropdown",
                            name: "siteCountry",
                            minWidth: "256px",
                            startWithNewLine: false,
                            title: "Country",
                            titleLocation: "top",
                            defaultValueExpression: "{country}",
                            isRequired: true,
                            readOnly: true,
                            choicesByUrl: {
                                url: "http://surveyjs.io/api/CountriesExample"
                            },
                            placeholder: "Country",
                            allowClear: false
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
                            validators: [
                                {
                                    type: "regex",
                                    regex: "^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-](:[a-zA-Z0-9-]{0,61}[a-zA-Z0-])?(:\.[a-zA-Z0-](:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
                                    text: "Please enter a valid email address."
                                }
                            ],
                            placeholder: "Enter site email"
                        }
                    ]
                }

            ]
        },
        {
            name: "customer-additional-info",
            title: "Additional Information",
            elements: [

                {
                    type: "text",
                    name: "contactInformation1",
                    maxLength: 150,
                    minWidth: "256px",
                    title: "Contact Info 1",
                    titleLocation: "top",
                    isRequired: false,
                    placeholder: "Extra text data"
                },
                {
                    type: "text",
                    name: "customerInformation2",
                    maxLength: 150,
                    minWidth: "256px",
                    title: "Customer Info 2",
                    titleLocation: "top",
                    startWithNewLine: false,
                    isRequired: false,
                    placeholder: "Extra text data"
                },


                {
                    type: "text",
                    inputType: "number",
                    name: "customerInformation3",
                    minWidth: "256px",
                    title: "Customer Info 3",
                    titleLocation: "top",
                    isRequired: false,
                    placeholder: "Extra numeric data"
                },
                {
                    type: "text",
                    inputType: "number",
                    name: "customerInformation4",
                    minWidth: "256px",
                    title: "Customer Info 4",
                    titleLocation: "top",
                    startWithNewLine: false,
                    isRequired: false,
                    placeholder: "Extra numeric data"
                },

                {
                    type: "text",
                    inputType: "date",
                    name: "customerInformation5",
                    minWidth: "256px",
                    title: "Customer Info 5",
                    titleLocation: "top",
                    isRequired: false,
                    placeholder: "Extra date data"
                },
                {
                    type: "text",
                    inputType: "date",
                    name: "customerInformation6",
                    minWidth: "256px",
                    title: "Customer Info 6",
                    titleLocation: "top",
                    startWithNewLine: false,
                    isRequired: false,
                    placeholder: "Extra date data"
                }


            ]
        },
        {
            name: "customer-tools",
            title: "Subscribed to Tools",
            elements: [

                {
                    type: "tagbox",
                    name: "workflows",
                    title: "Tools",
                    titleLocation: "top",
                    isRequired: false,
                    choices: [
                        {
                            value: "1",
                            text: "Tool 1"
                        },
                        {
                            value: "2",
                            text: "Tool 2"
                        },
                        {
                            value: "3",
                            text: "Tool 3"
                        },
                        {
                            value: "4",
                            text: "Tool 4"
                        }
                    ],
                    placeholder: "Select subscribed to tools"
                }


            ]
        }
    ],
    showPrevButton: true,
    showTOC: false,
    showTitle: false,
    showCompletedPage: false,
    checkErrorsMode: "onValueChanged",
    showQuestionNumbers: "off",
    questionErrorLocation: "bottom",
    completeText: "Save Customer",
    widthMode: "static",
    width: "900",

    showProgressBar: "belowheader",
    progressBarShowPageTitles: true,
    progressBarShowPageNumbers: true,
};