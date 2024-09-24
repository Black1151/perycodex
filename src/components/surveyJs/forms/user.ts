export const userJson = {
    pages: [
        {
            name: "user-details-section",
            title: "User Main Details",
            elements: [

                {
                    type: "boolean",
                    name: "userTypePaying",
                    title: "User Type",
                    titleLocation: "top",
                    startWithNewLine: true,
                    description: "Paying or Guest user?",
                    descriptionLocation: "underInput",
                    defaultValue: true,
                    isRequired: true,
                    labelTrue: "Paying (Int)",
                    labelFalse: "Guest (Ext)",
                    swapOrder: true
                },
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
                        }
                    ],
                    defaultValue: "CU",
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
                    choices: [
                        {
                            value: "1",
                            text: "Mr"
                        },
                        {
                            value: "2",
                            text: "Mrs"
                        },
                        {
                            value: "3",
                            text: "Ms"
                        },
                        {
                            value: "4",
                            text: "Dr"
                        },
                        {
                            value: "5",
                            text: "Rev"
                        },
                        {
                            value: "6",
                            text: "Prof"
                        }
                    ],
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
                    name: "jobTypeId",
                    // width: "64%",
                    // minWidth: "192px",
                    title: "Contract Type",
                    titleLocation: "top",
                    description: "Enter contract type",
                    descriptionLocation: "underInput",
                    isRequired: false,
                    visibleIf: "{userTypePaying} = true",
                    choices: [
                        {
                            value: "1",
                            text: "Full-time"
                        },
                        {
                            value: "2",
                            text: "Part-time"
                        },
                        {
                            value: "3",
                            text: "Contractor"
                        },
                        {
                            value: "4",
                            text: "Temporary"
                        }
                    ],
                    placeholder: "Select Contract type",
                    allowClear: false
                },
                {
                    type: "dropdown",
                    name: "roleTypeId",
                    // width: "64%",
                    // minWidth: "192px",
                    title: "Job Level",
                    titleLocation: "top",
                    description: "Enter job level",
                    descriptionLocation: "underInput",
                    startWithNewLine: false,
                    isRequired: false,
                    choices: [
                        {
                            value: "1",
                            text: "Director"
                        },
                        {
                            value: "2",
                            text: "Senior Manager"
                        },
                        {
                            value: "3",
                            text: "Manager"
                        },
                        {
                            value: "4",
                            text: "Staff"
                        },
                        {
                            value: "5",
                            text: "Graduate"
                        },
                        {
                            value: "6",
                            text: "Junior"
                        },
                        {
                            value: "7",
                            text: "Apprentice"
                        }
                    ],
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
                    "visibleI": "{remoteWorker} = true"
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
                    choices: [
                        {
                            value: "1",
                            text: "Do not include in any notifications"
                        },
                        {
                            value: "2",
                            text: "Include in all notifications"
                        },
                        {
                            value: "3",
                            text: "List specific ones based on tools"
                        }
                    ],
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
                    name: "profile",
                    rows: 3,
                    autoGrow: true,
                    maxLength: 500,
                    minWidth: "256px",
                    title: "Profile Bio",
                    titleLocation: "top",
                    isRequired: false,
                    placeholder: "Enter user profile bio information here"
                },

                {
                    type: "comment",
                    name: "currentAndPastProjectsOfNote",
                    rows: 3,
                    autoGrow: true,
                    maxLength: 500,
                    minWidth: "256px",
                    title: "Current & Past Projects",
                    titleLocation: "top",
                    isRequired: false,
                    placeholder: "Enter details of current and past projects here"
                }


            ]
        },

        {
            name: "user-skills-section",
            title: "Skills & Expertise",
            visibleIf: "{userTypePaying} = true",
            elements: [
                {
                    type: "paneldynamic",
                    name: "skills",
                    "titl": "Add Skills",
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
                            name: "level",
                            minWidth: "256px",
                            title: "Level",
                            titleLocation: "top",
                            startWithNewLine: false,
                            isRequired: true,
                            choices: [
                                {
                                    value: "1",
                                    text: "Level 1 (Beginner)"
                                },
                                {
                                    value: "2",
                                    text: "Level 2 (Novice)"
                                },
                                {
                                    value: "3",
                                    text: "Level 3 (Intermediate)"
                                },
                                {
                                    value: "4",
                                    text: "Level 4 (Advanced)"
                                },
                                {
                                    value: "5",
                                    text: "Level 5 (Expert)"
                                }
                            ],
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
            elements: [
                {
                    type: "paneldynamic",
                    name: "qualifications",
                    "titl": "Add Qualifications",
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
            elements: [
                {
                    type: "paneldynamic",
                    name: "sectorExperiences",
                    "titl": "Add Sector Experiences",
                    templateElements: [
                        {
                            type: "dropdown",
                            name: "experienceSectorId",
                            width: "64%",
                            minWidth: "192px",
                            title: "Sector",
                            titleLocation: "top",
                            description: "Select the sector",
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
                            type: "comment",
                            name: "explanation",
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
            elements: [
                {
                    type: "matrixdynamic",
                    name: "languages",
                    title: "Add Languages",
                    columns: [

                        {
                            type: "dropdown",
                            name: "language",
                            width: "64%",
                            minWidth: "192px",
                            title: "Language List",
                            titleLocation: "top",
                            description: "Select language",
                            descriptionLocation: "underInput",
                            isRequired: true,
                            choices: [
                                'Abkhaz',
                                'Afrikaans',
                                'Akan',
                                'Albanian',
                                'Amharic',
                                'Arabic',
                                'Aragonese',
                                'Armenian',
                                'Assamese',
                                'Avaric',
                                'Avestan',
                                'Aymara',
                                'Azerbaijani',
                                'Bambara',
                                'Bashkir',
                                'Basque',
                                'Belarusian',
                                'Bengali',
                                'Bihari',
                                'Bislama',
                                'Bosnian',
                                'Breton',
                                'Bulgarian',
                                'Burmese',
                                'Castilian',
                                'Catalan',
                                'Chamorro',
                                'Chechen',
                                'Chuvash',
                                'Cornish',
                                'Corsican',
                                'Cree',
                                'Croatian',
                                'Czech',
                                'Danish',
                                'Dutch',
                                'Dzongkha',
                                'English',
                                'Esperanto',
                                'Estonian',
                                'Ewe',
                                'Faroese',
                                'Fijian',
                                'Finnish',
                                'French',
                                'Fula',
                                'Gaelic',
                                'Galician',
                                'Ganda',
                                'Georgian',
                                'German',
                                'Greek',
                                'Greenlandic',
                                'Guarani',
                                'Gujarati',
                                'Haitian',
                                'Hausa',
                                'Hebrew',
                                'Herero',
                                'Hindi',
                                'Hiri Motu',
                                'Hungarian',
                                'Icelandic',
                                'Ido',
                                'Igbo',
                                'Indonesian',
                                'Interlingua',
                                'Interlingue',
                                'Inuktitut',
                                'Inupiaq',
                                'Irish',
                                'Italian',
                                'Japanese',
                                'Javanese',
                                'Kannada',
                                'Kanuri',
                                'Kashmiri',
                                'Kazakh',
                                'Khmer',
                                'Kikuyu',
                                'Kinyarwanda',
                                'Kirundi',
                                'Komi',
                                'Kongo',
                                'Korean',
                                'Kurdish',
                                'Kwanyama',
                                'Kyrgyz',
                                'Lao',
                                'Latin',
                                'Latvian',
                                'Limburgish',
                                'Lingala',
                                'Lithuanian',
                                'Luba-Katanga',
                                'Luxembourgish',
                                'Macedonian',
                                'Malagasy',
                                'Malay',
                                'Malayalam',
                                'Maldivian',
                                'Maltese',
                                'Mandarin Chinese',
                                'Manx',
                                'Maori',
                                'Marathi',
                                'Marshallese',
                                'Mongolian',
                                'Nauru',
                                'Navajo, Navaho',
                                'Ndonga',
                                'Nepali',
                                'North Ndebele',
                                'Northern Sami',
                                'Norwegian',
                                'Nuosu',
                                'Occitan',
                                'Ojibwe',
                                'Oriya',
                                'Oromo',
                                'Ossetian',
                                'Pāli',
                                'Pashto',
                                'Persian',
                                'Polish',
                                'Portuguese',
                                'Punjabi',
                                'Quechua',
                                'Romanian',
                                'Romansh',
                                'Russian',
                                'Samoan',
                                'Sango',
                                'Sanskrit',
                                'Sardinian',
                                'Serbian',
                                'Shona',
                                'Sindhi',
                                'Sinhalese',
                                'Slovak',
                                'Slovene',
                                'Somali',
                                'South Azerbaijani',
                                'South Ndebele',
                                'Southern Sotho',
                                'Spanish',
                                'Sundanese',
                                'Swahili',
                                'Swati',
                                'Swedish',
                                'Tagalog',
                                'Tahitian',
                                'Tajik',
                                'Tamil',
                                'Tatar',
                                'Telugu',
                                'Thai',
                                'Tibetan',
                                'Tigrinya',
                                'Tongan',
                                'Tsonga',
                                'Tswana',
                                'Turkish',
                                'Turkmen',
                                'Twi',
                                'Ukrainian',
                                'Urdu',
                                'Uyghur',
                                'Uzbek',
                                'Venda',
                                'Vietnamese',
                                'Volapük',
                                'Walloon',
                                'Welsh',
                                'Western Frisian',
                                'Wolof',
                                'Xhosa',
                                'Yiddish',
                                'Yoruba',
                                'Zhuang',
                                'Zulu'

                            ],
                            placeholder: "Select Language",
                            allowClear: false
                        },


                        {
                            name: "proficiency",
                            title: "Proficiency",
                            cellType: "dropdown",
                            isRequired: true,
                            allowClear: false,
                            placeholder: "Select proficiency",
                            choices: [
                                {
                                    value: "1",
                                    text: "Level 1 (Beginner)"
                                },
                                {
                                    value: "2",
                                    text: "Level 2 (Novice)"
                                },
                                {
                                    value: "3",
                                    text: "Level 3 (Intermediate)"
                                },
                                {
                                    value: "4",
                                    text: "Level 4 (Advanced)"
                                },
                                {
                                    value: "5",
                                    text: "Level 5 (Expert)"
                                }
                            ]
                        }
                    ],
                    rowCount: 0,
                    confirmDelete: true,
                    confirmDeleteText: "Are you sure you want to delete this language?",
                    addRowText: "Add a Language",
                    removeRowText: "Delete this Language",
                    hideColumnsIfEmpty: true,
                    emptyRowsText: "No languages entered yet.\nClick 'Add a Language' to add a new one.\nClick the delete icon to remove an existing entry."
                }

            ]
        },

        {
            name: "user-interests-section",
            title: "Interests",
            visibleIf: "{userTypePaying} = true",
            elements: [
                {
                    type: "matrixdynamic",
                    name: "hobbiesAndInterests",
                    title: "Add Interests",
                    columns: [
                        {
                            name: "interest",
                            title: "Interest",
                            cellType: "text",
                            isRequired: true,
                            maxLength: 80,
                            placeholder: "Enter interest",
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


        {
            name: "user-additional-info",
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
                    name: "contactInformation2",
                    maxLength: 150,
                    minWidth: "256px",
                    title: "Contact Info 2",
                    titleLocation: "top",
                    startWithNewLine: false,
                    isRequired: false,
                    placeholder: "Extra text data"
                },

                {
                    type: "text",
                    inputType: "number",
                    name: "contactInformation3",
                    minWidth: "256px",
                    title: "Contact Info 3",
                    titleLocation: "top",
                    isRequired: false,
                    placeholder: "Extra numeric data"
                },
                {
                    type: "text",
                    inputType: "number",
                    name: "contactInformation4",
                    minWidth: "256px",
                    title: "Contact Info 4",
                    titleLocation: "top",
                    startWithNewLine: false,
                    isRequired: false,
                    placeholder: "Extra numeric data"
                },
                {
                    type: "text",
                    inputType: "date",
                    name: "contactInformation5",
                    minWidth: "256px",
                    title: "Contact Info 5",
                    titleLocation: "top",
                    isRequired: false,
                    placeholder: "Extra date data"
                },
                {
                    type: "text",
                    inputType: "date",
                    name: "contactInformation6",
                    minWidth: "256px",
                    title: "Contact Info 6",
                    titleLocation: "top",
                    startWithNewLine: false,
                    isRequired: false,
                    placeholder: "Extra date data"
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
    completeText: "Save User",
    widthMode: "static",
    width: "900",
    showProgressBar: "belowheader",
    progressBarShowPageTitles: true,
    progressBarShowPageNumbers: true,
};