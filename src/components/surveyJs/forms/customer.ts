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
                    title: "Is this customer active?",
                    titleLocation: "top",
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
                    isRequired: true,
                    placeholder: "Enter the name of the customer"
                },
                {
                    type: "text",
                    name: "webAddress",
                    width: "36%",
                    minWidth: "256px",
                    title: "Web Address",
                    titleLocation: "top",
                    inputType: "url",
                    placeholder: "Enter the web address of the client's website"
                },
                {
                    type: "dropdown",
                    name: "businessTypeId",
                    width: "64%",
                    minWidth: "192px",
                    title: "Business Type",
                    titleLocation: "top",
                    isRequired: true,
                    "renderAs": "select",
                    choicesByUrl: {
                        url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/surveyjs/selectItems?type=business_type`,  // The API endpoint to fetch choices from
                        path: "business_type",
                        valueName: "value",
                        titleName: "label"
                    },
                    placeholder: "Select Business Type",
                    allowClear: false
                },
                {
                    type: "text",
                    name: "companyNo",
                    visibleIf: "{businessTypeId} = 3",
                    minWidth: "256px",
                    title: "Company Number",
                    titleLocation: "top",
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
                    placeholder: "Enter Company Number In accordance with Companies House"
                },
                {
                    type: "text",
                    name: "sicCode",
                    visibleIf: "{businessTypeId} = 3",
                    minWidth: "256px",
                    startWithNewLine: false,
                    title: "SIC Code",
                    titleLocation: "top",
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
                    placeholder: "Enter business SIC Code"
                },
                {
                    type: "boolean",
                    name: "multiSite",
                    title: "Select if this a single or multiple site business",
                    titleLocation: "top",
                    defaultValue: true,
                    isRequired: true,
                    labelTrue: "Single",
                    labelFalse: "Multiple",
                    swapOrder: true
                }
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
                    descriptionLocation: "underTitle",
                    isRequired: true,
                    "renderA": "select",
                    choicesByUrl: {
                        url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/surveyjs/selectItems?type=sector`,
                        path: "sector",
                        valueName: "value",
                        titleName: "label"
                    },
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
                    descriptionLocation: "underTitle",
                    isRequired: true,
                    searchEnabled: false,
                    choicesByUrl: {
                        url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/surveyjs/selectItems?type=region`,  // The API endpoint to fetch choices from
                        path: "region",
                        valueName: "value",
                        titleName: "label"
                    },
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
                    descriptionLocation: "underTitle",
                    isRequired: true,
                    choicesByUrl: {
                        url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/surveyjs/selectItems?type=company_size`,  // The API endpoint to fetch choices from
                        path: "company_size",
                        valueName: "value",
                        titleName: "label"
                    },
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
                    isRequired: true,
                    inputType: "number",
                    min: 1,
                    step: 1,
                    validators: [
                        {
                            type: "expression",
                            text: "Not within the selected Company Size employee range",
                            expression: "({companySizeId} = 51 and {numberOfEmployees} <= 10) or ({companySizeId} = 52 and {numberOfEmployees} > 10 and {numberOfEmployees} <= 50) or ({companySizeId} = 53 and {numberOfEmployees} > 51 and {numberOfEmployees} <= 250) or ({companySizeId} = 54 and {numberOfEmployees} > 250)"
                        }
                    ],
                    placeholder: "Enter the number of current Employees"
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
                    description: "",
                    descriptionLocation: "underInput",
                    isRequired: true,
                    placeholder: "Enter a customer code for internal reference"
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
                    // { TODO: Rocco will scrape
                    //     name: "choicesByUrlTest",
                    //     type: "dropdown",
                    //     choicesByUrl: {
                    //         url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/surveyjs/selectItems?type=country_code`,  // The API endpoint to fetch choices from
                    //         path: "country_code",
                    //         valueName: "value",
                    //         titleName: "label"
                    //     }
                    // },
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
                            isRequired: false,
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
                            isRequired: false,
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
                            isRequired: false,
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
                            placeholder: "Enter site email"
                        }
                    ]
                }
            ]
        },
    ],
};