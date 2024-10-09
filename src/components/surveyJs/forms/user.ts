export const userJson = {
        pages: [
            {
                name: "user-details-section",
                title: "User Main Details",
                elements: [
                    {
                        type: "dropdown",
                        name: "role",
                        title: "User Role",
                        titleLocation: "top",
                        startWithNewLine: false,
                        description: "Select role",
                        descriptionLocation: "underInput",
                        setValueIf: "{userTypePaying} = false",
                        setValueExpression: "'EU'",
                        isRequired: true,
                        choices: [
                            {
                                value: "EU",
                                text: "External User",
                                visibleIf: "{userTypePaying} = false"
                            },
                            {
                                value: "CU",
                                text: "Customer User",
                                visibleIf: "{userTypePaying} = true"
                            },
                            {
                                value: "CS",
                                text: "Customer Senior User",
                                visibleIf: "{userTypePaying} = true"
                            },
                            {
                                value: "CL",
                                text: "Customer Leader",
                                visibleIf: "{userTypePaying} = true"
                            },
                            {
                                value: "CA",
                                text: "Customer Admin",
                                visibleIf: "{userTypePaying} = true"
                            },
                        ],
                        placeholder: "Select Role",
                        allowClear: false
                    },
                    {
                        type: "boolean",
                        name: "isActive",
                        title: "Active?",
                        titleLocation: "top",
                        startWithNewLine: false,
                        description: "Is this contact active?",
                        descriptionLocation: "underInput",
                        defaultValue: true,
                        isRequired: true,
                        labelTrue: "Yes",
                        labelFalse: "No",
                        swapOrder: true
                    },
                    {
                        type: "dropdown",
                        name: "titleId",
                        title: "Title",
                        titleLocation: "top",
                        description: "Enter title",
                        descriptionLocation: "underInput",
                        isRequired: true,
                        choicesByUrl: {
                            url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/surveyjs/selectItems?type=title`,  // The API endpoint to fetch choices from
                            path: "title",
                            valueName: "value",
                            titleName: "label"
                        },
                        placeholder: "Select title",
                        allowClear: false
                    },
                    {
                        type: "text",
                        name: "firstName",
                        // width: "64%",
                        // minWidth: "192px",
                        title: "First name",
                        titleLocation: "top",
                        description: "Enter the first name of user",
                        descriptionLocation: "underInput",
                        isRequired: true,
                        placeholder: "First name"
                    },
                    {
                        type: "text",
                        name: "lastName",
                        // width: "64%",
                        // minWidth: "192px",
                        title: "Surname",
                        titleLocation: "top",
                        description: "Enter the surname of user",
                        descriptionLocation: "underInput",
                        startWithNewLine: false,
                        isRequired: true,
                        placeholder: "Surname"
                    },
                    {
                        type: "text",
                        name: "jobTitle",
                        width: "36%",
                        minWidth: "256px",
                        title: "Job Title",
                        titleLocation: "top",
                        description: "Enter the job title of contact",
                        descriptionLocation: "underInput",
                        inputType: "url",
                        placeholder: "Job title"
                    },
                    {
                        type: "dropdown",
                        name: "departmentId",
                        // width: "64%",
                        // minWidth: "192px",
                        title: "Department",
                        titleLocation: "top",
                        description: "Enter (customer) department / service user works in",
                        descriptionLocation: "underInput",
                        isRequired: true,
                        visibleIf: "{userTypePaying} = true",
                        // TODO Route for userTeam based on null
                        choices: [
                            {
                                value: "1",
                                text: "Dept1"
                            },
                            {
                                value: "2",
                                text: "Dept2"
                            },
                            {
                                value: "3",
                                text: "Dept3"
                            },
                            {
                                value: "4",
                                text: "Dept4"
                            }
                        ],
                        placeholder: "Select Dept / Service",
                        allowClear: false
                    },
                    {
                        type: "dropdown",
                        name: "teamId",
                        //width: "64%",
                        // minWidth: "192px",
                        title: "Team",
                        titleLocation: "top",
                        description: "Enter (customer) team user works in",
                        descriptionLocation: "underInput",
                        startWithNewLine: false,
                        isRequired: true,
                        visibleIf: "{userTypePaying} = true",
                        // TODO: Route for userTeam where parentId = not-null
                        choices: [
                            {
                                value: "1",
                                text: "Team1"
                            },
                            {
                                value: "2",
                                text: "Team2"
                            },
                            {
                                value: "3",
                                text: "Team3"
                            },
                            {
                                value: "4",
                                text: "Team4"
                            }
                        ],
                        placeholder: "Select team",
                        allowClear: false
                    },
                    {
                        type: "dropdown",
                        name: "contractTypeId",
                        // width: "64%",
                        // minWidth: "192px",
                        title: "Contract Type",
                        titleLocation: "top",
                        description: "Enter contract type",
                        descriptionLocation: "underInput",
                        isRequired: false,
                        visibleIf: "{userTypePaying} = true",
                        choicesByUrl: {
                            url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/surveyjs/selectItems?type=job_type`,  // The API endpoint to fetch choices from
                            path: "job_type",
                            valueName: "value",
                            titleName: "label"
                        },
                        placeholder: "Select Contract type",
                        allowClear: false
                    },
                    {
                        type: "dropdown",
                        name: "jobLevelId",
                        // width: "64%",
                        // minWidth: "192px",
                        title: "Job Level",
                        titleLocation: "top",
                        description: "Enter job level",
                        descriptionLocation: "underInput",
                        startWithNewLine: false,
                        isRequired: false,
                        choicesByUrl: {
                            url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/surveyjs/selectItems?type=job_level`,  // The API endpoint to fetch choices from
                            path: "job_level",
                            valueName: "value",
                            titleName: "label"
                        },
                        placeholder: "Select Job Level",
                        allowClear: false
                    },
                    {
                        type: "text",
                        inputType: "date",
                        name: "employStartDate",
                        minWidth: "256px",
                        title: "Employment Start Date",
                        titleLocation: "top",
                        isRequired: true,
                        placeholder: "Employment Start Date",
                        visibleIf: "{userTypePaying} = true",
                    },
                ]
            },
            {
                name: "contact-details-section",
                title: "Contact Details",
                elements: [
                    {
                        type: "text",
                        name: "email",
                        inputType: "email",
                        title: "Email",
                        titleLocation: "top",
                        description: "Enter the email of the user",
                        descriptionLocation: "underInput",
                        isRequired: true,
                        placeholder: "name@email.com"
                    },
                    {
                        type: "text",
                        name: "mobile",
                        title: "Mobile",
                        minWidth: "256px",
                        description: "Enter the mobile of the user",
                        descriptionLocation: "underInput",
                        isRequired: true,
                        inputType: "tel",
                        maskType: "pattern",
                        maskSettings: {
                            pattern: "9999 9999999"
                        }
                    },
                    {
                        type: "text",
                        name: "telephone",
                        title: "Telephone",
                        minWidth: "256px",
                        startWithNewLine: false,
                        description: "Enter the telephone of the user",
                        descriptionLocation: "underInput",
                        isRequired: false,
                        inputType: "tel",
                        maskType: "pattern",
                        maskSettings: {
                            pattern: "9999 9999999"
                        }
                    },
                    {
                        type: "text",
                        name: "vehicleRegistration",
                        title: "Vehicle Registration",
                        titleLocation: "top",
                        description: "Enter vehicle reg of the user",
                        descriptionLocation: "underInput",
                        isRequired: false,
                        visibleIf: "{userTypePaying} = true"
                    },
                    {
                        type: "boolean",
                        name: "remoteWorker",
                        minWidth: "256px",
                        title: "Are you primarily a remote worker?",
                        titleLocation: "top",
                        description: "You are not office based, often work remotely",
                        descriptionLocation: "underInput",
                        defaultValue: false,
                        isRequired: true,
                        labelTrue: "Yes",
                        labelFalse: "No"
                    },
                    {
                        type: "dropdown",
                        name: "siteId",
                        minWidth: "256px",
                        title: "Main Office Base (Site)",
                        titleLocation: "top",
                        description: "Select your company site / office you are based at",
                        descriptionLocation: "underInput",
                        isRequired: true,
                        // TODO: Need to route from site / allBy
                        choices: [
                            {
                                value: "1",
                                text: "Site1"
                            },
                            {
                                value: "2",
                                text: "Site2"
                            },
                            {
                                value: "3",
                                text: "Site3"
                            }
                        ],
                        placeholder: "Select user site / office",
                        allowClear: false,
                        "visibleI": "{remoteWorker} = false"
                    },
                    {
                        type: "dropdown",
                        name: "siteId",
                        minWidth: "256px",
                        title: "Main Work Location",
                        titleLocation: "top",
                        description: "You are a remote worker",
                        descriptionLocation: "underInput",
                        isRequired: true,
                        choices: [
                            {
                                value: "0",
                                text: "Remote Worker"
                            }
                        ],
                        allowClear: false,
                        defaultValue: "0",
                        readOnly: true,
                        visibleIf: "{remoteWorker} = true"
                    },
                    {
                        type: "dropdown",
                        name: "marketingOptOutId",
                        minWidth: "256px",
                        title: "GDPR / Marketing",
                        titleLocation: "top",
                        description: "Select the appropriate option for the user.",
                        descriptionLocation: "underInput",
                        isRequired: true,
                        visibleIf: "{userTypePaying} = false",
                        choicesByUrl: {
                            url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/surveyjs/selectItems?type=marketing_opt_out`,  // The API endpoint to fetch choices from
                            path: "marketing_opt_out",
                            valueName: "value",
                            titleName: "label"
                        },
                        placeholder: "Select appropriate option",
                        allowClear: false
                    }
                ]
            },
            {
                name: "user-about-section",
                title: "About",
                visibleIf: "{userTypePaying} = true",
                elements: [
                    {
                        type: "comment",
                        name: "aboutMe",
                        rows: 3,
                        autoGrow: true,
                        maxLength: 500,
                        minWidth: "256px",
                        title: "Profile Bio",
                        titleLocation: "top",
                        isRequired: false,
                        placeholder: "Enter user profile bio information here"
                    },
                ]
            },
            {
                name: "projects-section",
                title: "Projects",
                visibleIf: "{userTypePaying} = true",
                elements: [
                    {
                        type: "paneldynamic",
                        name: "projects",
                        title: "Add Projects",
                        templateElements: [
                            {
                                type: "text",
                                name: "project",
                                title: "Project",
                                titleLocation: "top",
                                isRequired: true,
                                placeholder: "Enter project name"
                            },
                            {
                                type: "comment",
                                name: "description",
                                title: "Description",
                                titleLocation: "top",
                                isRequired: true,
                                placeholder: "Enter project details"
                            },
                            {
                                type: "text",
                                name: "whereAt",
                                title: "Where did you complete this project?",
                                titleLocation: "top",
                                isRequired: true,
                                placeholder: "Remote / Online / Company"
                            },
                            {
                                type: "text",
                                name: "startDate",
                                inputType: "date",
                                title: "Date Started",
                                titleLocation: "top",
                                isRequired: true,
                                placeholder: "Enter date project started"
                            },
                            {
                                type: "text",
                                name: "endDate",
                                inputType: "date",
                                title: "Date Completed",
                                titleLocation: "top",
                                startWithNewLine: false,
                                isRequired: true,
                                placeholder: "Enter date project completed"
                            },
                        ],
                        panelCount: 0,
                        minPanelCount: 0,
                        panelAddText: "Add New Project",
                        confirmDelete: true,
                        confirmDeleteText: "Are you sure you want to delete this project?",
                        noEntriesText: "No project entered yet.\nClick 'Add New Project' to add a new entry.\nClick 'Remove' to delete an existing entry."
                    }
                ]
            },
            {
                name: "user-skills-section",
                title: "Skills & Expertise",
                visibleIf: "{userTypePaying} = true",
                elements:
                    [
                        {
                            type: "paneldynamic",
                            name: "skills",
                            title: "Add Skills",
                            templateElements: [
                                {
                                    type: "text",
                                    name: "skill",
                                    title: "Skill",
                                    titleLocation: "top",
                                    isRequired: true,
                                    placeholder: "Enter skill or expertise"
                                },
                                {
                                    type: "dropdown",
                                    name: "proficiencyId",
                                    minWidth: "256px",
                                    title: "Level",
                                    titleLocation: "top",
                                    startWithNewLine: false,
                                    isRequired: true,
                                    choicesByUrl: {
                                        url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/surveyjs/selectItems?type=proficiency`,  // The API endpoint to fetch choices from
                                        path: "proficiency",
                                        valueName: "value",
                                        titleName: "label"
                                    },
                                    placeholder: "Select level",
                                    allowClear: false
                                }
                            ],
                            panelCount: 0,
                            minPanelCount: 0,
                            panelAddText: "Add New Skill",
                            confirmDelete: true,
                            confirmDeleteText: "Are you sure you want to delete this skill?",
                            noEntriesText: "No skills entered yet.\nClick 'Add New Skill' to add a new entry.\nClick 'Remove' to delete an existing entry."
                        }
                    ]
            },
            {
                name: "user-qualifications-section",
                title: "Qualifications & Training",
                visibleIf: "{userTypePaying} = true",
                elements:
                    [
                        {
                            type: "paneldynamic",
                            name: "training",
                            title: "Add Qualifications",
                            templateElements: [
                                {
                                    type: "text",
                                    name: "training",
                                    title: "Qualification",
                                    titleLocation: "top",
                                    isRequired: true,
                                    placeholder: "Enter qualification or training"
                                },
                                {
                                    type: "text",
                                    name: "startDate",
                                    inputType: "date",
                                    title: "Date Started",
                                    titleLocation: "top",
                                    isRequired: true,
                                    placeholder: "Enter date training started"
                                },
                                {
                                    type: "text",
                                    name: "endDate",
                                    inputType: "date",
                                    title: "Date Achieved",
                                    titleLocation: "top",
                                    startWithNewLine: false,
                                    isRequired: true,
                                    placeholder: "Enter date achieved"
                                },
                            ],
                            panelCount: 0,
                            minPanelCount: 0,
                            panelAddText: "Add New Qualification",
                            confirmDelete: true,
                            confirmDeleteText: "Are you sure you want to delete this qualification?",
                            noEntriesText: "No qualifications entered yet.\nClick 'Add New Qualification' to add a new entry.\nClick 'Remove' to delete an existing entry."
                        }
                    ]
            },
            {
                name: "user-sectorexperience-section",
                title: "Sector Experience",
                visibleIf: "{userTypePaying} = true",
                elements:
                    [
                        {
                            type: "paneldynamic",
                            name: "sectorExperiences",
                            title: "Add Sector Experiences",
                            templateElements: [
                                {
                                    type: "dropdown",
                                    name: "sectorId",
                                    width: "64%",
                                    minWidth: "192px",
                                    title: "Sector",
                                    titleLocation: "top",
                                    description: "Select the sector",
                                    descriptionLocation: "underInput",
                                    isRequired: true,
                                    choicesByUrl: {
                                        url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/surveyjs/selectItems?type=sector`,  // The API endpoint to fetch choices from
                                        path: "sector",
                                        valueName: "value",
                                        titleName: "label"
                                    },
                                    placeholder: "Select Sector",
                                    allowClear: false
                                },
                                {
                                    type: "comment",
                                    name: "description",
                                    rows: 3,
                                    autoGrow: true,
                                    maxLength: 300,
                                    minWidth: "256px",
                                    title: "Details",
                                    titleLocation: "top",
                                    isRequired: false,
                                    placeholder: "Enter experience details here"
                                },
                            ],
                            panelCount: 0,
                            minPanelCount: 0,
                            panelAddText: "Add New Experience",
                            confirmDelete: true,
                            confirmDeleteText: "Are you sure you want to delete this experience?",
                            noEntriesText: "No experiences entered yet.\nClick 'Add New Experience' to add a new entry.\nClick 'Remove' to delete an existing entry."
                        }
                    ]
            },
            {
                name: "user-languages-section",
                title: "Languages",
                visibleIf: "{userTypePaying} = true",
                elements:
                    [
                        {
                            type: "paneldynamic",
                            name: "languages",
                            title: "Add Languages",
                            templateElements: [
                                {
                                    type: "dropdown",
                                    name: "languageId",
                                    minWidth: "256px",
                                    title: "Language",
                                    titleLocation: "top",
                                    startWithNewLine: false,
                                    isRequired: true,
                                    choicesByUrl: {
                                        url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/surveyjs/selectItems?type=language`,
                                        path: "language",
                                        valueName: "value",
                                        titleName: "label"
                                    },
                                    placeholder: "Select language",
                                    allowClear: false
                                },
                                {
                                    type: "dropdown",
                                    name: "proficiencyId",
                                    minWidth: "256px",
                                    title: "Level",
                                    titleLocation: "top",
                                    startWithNewLine: false,
                                    isRequired: true,
                                    choicesByUrl: {
                                        url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/surveyjs/selectItems?type=proficiency`,  // The API endpoint to fetch choices from
                                        path: "proficiency",
                                        valueName: "value",
                                        titleName: "label"
                                    },
                                    placeholder: "Select level",
                                    allowClear: false
                                }
                            ],
                            panelCount: 0,
                            minPanelCount: 0,
                            panelAddText: "Add New Language",
                            confirmDelete: true,
                            confirmDeleteText: "Are you sure you want to delete this language?",
                            noEntriesText: "No languages entered yet.\nClick 'Add New Language' to add a new entry.\nClick 'Remove' to delete an existing entry."
                        }
                    ],
            },
            {
                name: "user-interests-section",
                title: "Interests",
                visibleIf: "{userTypePaying} = true",
                elements:
                    [
                        {
                            type: "matrixdynamic",
                            name: "hobbiesAndInterests",
                            title: "Add Interests",
                            columns: [
                                {
                                    title: "Interest",
                                    name: "hobby",
                                    cellType: "text",
                                    isRequired: true,
                                    maxLength: 80,
                                    placeholder: "Enter interest",
                                },
                                {
                                    title: "Details",
                                    name: "description",
                                    cellType: "text",
                                    isRequired: false,
                                    maxLength: 80,
                                    placeholder: "Enter information you want to about the hobby",
                                }
                            ],
                            rowCount: 0,
                            confirmDelete: true,
                            confirmDeleteText: "Are you sure you want to delete this interest?",
                            addRowText: "Add an Interest",
                            removeRowText: "Delete this Interest",
                            hideColumnsIfEmpty: true,
                            emptyRowsText: "No interests entered yet.\nClick 'Add an Interest' to add a new one.\nClick the delete icon to remove an existing entry."
                        }
                    ]
            },
        ],
        calculatedValues: [
            {
                name: "userTypePaying",
                expression: "iif({role} = 'EU', false, true)",
                includeIntoResult: false
            }
        ],
    }
;