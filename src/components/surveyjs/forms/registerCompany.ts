export const registerCustomerJson = {
  pages: [
    /* ─────────────────────────────  1 ▸ COMPANY DETAILS  ───────────────────────────── */
    // {
    //   name: "company-details",
    //   title: "Company Details",
    //   elements: [
    //     {
    //       type: "text",
    //       name: "name",
    //       width: "66%",
    //       title: "Company Name",
    //       titleLocation: "top",
    //       isRequired: true,
    //       placeholder: "Enter the name of your company",
    //     },

    //     {
    //       type: "text",
    //       name: "telephone", // NEW ① tel field
    //       title: "Telephone",
    //       inputType: "tel",
    //       minWidth: "256px",
    //       placeholder: "+44 20 7946 0018",
    //       // Simple UK‑style number pattern – tweak as needed
    //       validators: [
    //         {
    //           type: "regex",
    //           regex: "^\\+?[0-9\\s()\\-]{7,15}$",
    //           text: "Please enter a valid phone number",
    //         },
    //       ],
    //     },

    //     {
    //       type: "dropdown",
    //       name: "sectorId",
    //       title: "Sector",
    //       titleLocation: "top",
    //       minWidth: "192px",
    //       isRequired: true,
    //       placeholder:
    //         "Select the primary sector in which this business operates",
    //       allowClear: true,
    //       choicesByUrl: {
    //         url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/surveyjs/selectItems?type=sector`,
    //         path: "sector",
    //         valueName: "value",
    //         titleName: "label",
    //       },
    //     },
    //     {
    //       type: "dropdown",
    //       name: "regionId",
    //       minWidth: "192px",
    //       title: "Region",
    //       titleLocation: "top",
    //       isRequired: true,
    //       startWithNewLine: false,
    //       searchEnabled: false,
    //       placeholder: "Select the region in which this business operates",
    //       allowClear: true,
    //       choicesByUrl: {
    //         url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/surveyjs/selectItems?type=region`,
    //         path: "region",
    //         valueName: "value",
    //         titleName: "label",
    //       },
    //     },
    //     {
    //       type: "dropdown",
    //       name: "companySizeId",
    //       minWidth: "256px",
    //       title: "Company Size",
    //       titleLocation: "top",
    //       isRequired: true,
    //       allowClear: true,
    //       placeholder: "Select Company Size",
    //       choicesByUrl: {
    //         url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/surveyjs/selectItems?type=company_size`,
    //         path: "company_size",
    //         valueName: "value",
    //         titleName: "label",
    //       },
    //     },
    //     {
    //       type: "text",
    //       name: "numberOfEmployees",
    //       minWidth: "256px",
    //       startWithNewLine: false,
    //       title: "Number of Employees",
    //       titleLocation: "top",
    //       isRequired: true,
    //       inputType: "number",
    //       min: 1,
    //       step: 1,
    //       validators: [
    //         {
    //           type: "expression",
    //           text: "Not within the selected Company Size employee range",
    //           /* unchanged expression */
    //           expression:
    //             "({companySizeId} = 51 and {numberOfEmployees} <= 10) or ({companySizeId} = 52 and {numberOfEmployees} > 10 and {numberOfEmployees} <= 50) or ({companySizeId} = 53 and {numberOfEmployees} > 51 and {numberOfEmployees} <= 250) or ({companySizeId} = 54 and {numberOfEmployees} > 250)",
    //         },
    //       ],
    //       placeholder: "Enter the number of current Employees",
    //     },

    //     /* ───────── NEW: Company logo upload ──────── */
    //     {
    //       type: "file", // NEW ② logo upload
    //       name: "companyLogo",
    //       title: "Company Logo",
    //       acceptedTypes: "image/*",
    //       storeDataAsText: false, // keep as file object (base64) in result
    //       maxSize: 5242880, // 5 MB
    //       showPreview: true,
    //       placeholder: "Upload a JPG, PNG or SVG (max 5 MB)",
    //     },
    //   ],
    // },

    // /* ─────────────────────────────  2 ▸ COMPANY SITES  ───────────────────────────── */
    // {
    //   name: "customer-sites",
    //   title: "Company Sites",
    //   elements: [
    //     {
    //       type: "paneldynamic",
    //       name: "customerSites",
    //       title:
    //         "Enter your company locations below. (First being the primary location)",
    //       panelCount: 1,
    //       maxPanelCount: 3,

    //       templateElements: [
    //         /* ───────── always shown ───────── */
    //         {
    //           type: "text",
    //           name: "siteName",
    //           title: "Site Name",
    //           isRequired: true,
    //           placeholder: "e.g. Head Office",
    //         },
    //         {
    //           type: "text",
    //           name: "address1",
    //           title: "No. / Name & Street",
    //           minWidth: "256px",
    //           isRequired: true,
    //           placeholder: "No. / Name & Street",
    //         },
    //         {
    //           type: "text",
    //           name: "postcode",
    //           title: "Postcode",
    //           minWidth: "256px",
    //           isRequired: true,
    //           placeholder: "Postcode",
    //         },
    //         {
    //           type: "dropdown",
    //           name: "country",
    //           title: "Country",
    //           minWidth: "256px",
    //           startWithNewLine: false,
    //           allowClear: true,
    //           choicesOrder: "asc",
    //           isRequired: true,
    //           choicesByUrl: {
    //             url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/surveyjs/selectItems?type=country`,
    //             path: "country",
    //             valueName: "value",
    //             titleName: "label",
    //           },
    //         },
    //       ],
    //     },
    //   ],
    // },

    // /* ─────────────────────────────  3 ▸ COMPANY DEPARTMENTS  ─────────────────────── */
    // {
    //   name: "company-departments",
    //   title: "Company Departments",
    //   elements: [
    //     {
    //       type: "paneldynamic",
    //       name: "departments",
    //       title: "Add your departments",
    //       panelCount: 1,
    //       minPanelCount: 1,
    //       renderMode: "list",
    //       templateElements: [
    //         {
    //           type: "text",
    //           name: "departmentName",
    //           title: "Department Name",
    //           isRequired: true,
    //           placeholder: "e.g. Sales",
    //         },
    //         {
    //           type: "comment",
    //           name: "departmentDescription",
    //           title: "Description",
    //           placeholder: "What does this department do?",
    //         },
    //         /* hidden flag required by backend */
    //         {
    //           type: "boolean",
    //           name: "isDepartment",
    //           defaultValue: true,
    //           visible: false,
    //         },
    //       ],
    //     },
    //   ],
    // },

    // /* ─────────────────────────────  4 ▸ COMPANY STAFF  ───────────────────────────── */
    // {
    //   name: "company-staff",
    //   title: "Company Staff",
    //   elements: [
    //     {
    //       type: "paneldynamic",
    //       name: "companyStaff",
    //       title: "Enter up to five staff email addresses",
    //       panelCount: 1,
    //       maxPanelCount: 5,
    //       renderMode: "list",
    //       templateElements: [
    //         {
    //           type: "text",
    //           name: "staffEmail",
    //           title: "Staff Email",
    //           inputType: "email",
    //           isRequired: true,
    //           placeholder: "name@example.com",
    //           validators: [
    //             { type: "email", text: "Please enter a valid email address" },
    //           ],
    //         },
    //       ],
    //     },
    //   ],
    // },

    /* ─────────────────────────────  5 ▸ TOOL SELECTION  ──────────────────────────── */
    // {
    //   name: "tool-selection",
    //   title: "Tool Selection",
    //   elements: [
    //     {
    //       type: "checkbox",
    //       name: "selectedTools",
    //       title: "Select the tools you'd like to use",
    //       isRequired: true,
    //       valuePropertyName: "id",
    //       hideNumber: true,

    //       // ── Fetch choices from your endpoint
    //       choicesByUrl: {
    //         url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/toolConfig/allBy`,
    //         path: "resource",
    //         valueName: "id",
    //         titleName: "displayName",
    //         // if you have imageLinkName / descriptionName fields:
    //         imageLinkName: "imageUrl",
    //         descriptionName: "description",
    //       },

    //       // ── Only show those choices whose `isTrialable` flag is true
    //       choicesVisibleIf: "{isTrialable} = true",

    //       // ── Tell the question to render those images & descriptions:
    //       showImage: true,
    //       showDescription: true,
    //     },
    //   ],
    // },

    {
      name: 'tool-selection',
      title: 'Tool Selection',
      elements: [
        {
          type: 'paneldynamic',
          name: 'toolPanels',
          title: 'Select the tools you\'d like to use',
          isRequired: true,
    
          // ▶─ only fetch when the array is empty (length === 0)
          setValueIf: '1=1',
    
          // ▶─ your helper returns an array of tool objects
          setValueExpression:
            "perygonApiRequest('/toolConfig/allBy', '', 'displayName:displayName|iconImageUrl:imageUrl|previewText:previewText|isTrialable:isTrialable')",
    
          // ▶─ zero panels until your data arrives
          // panelCount: '{toolPanels.length}',
    
          // ▶─ show a spinner or text while loading
          // emptyPanelText: 'Loading tools…',
    
          templateElements: [
            {
              type: "text",
              name: "displayName",
              title: "Tool Name",
            },
            {
              type: 'comment',
              name: 'previewText',
              title: 'About this tool',
            },
            {
              type: 'boolean',
              name: 'isTrialable',
              title: 'Use this tool?',
              labelTrue: 'Yes',
              labelFalse: 'No',
              defaultValue: false
            }
          ],
    
          allowAddPanel: false,
          allowRemovePanel: false,
        }
      ]
    }
    
    
    
  ],
};
