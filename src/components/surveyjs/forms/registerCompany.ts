export const registerCustomerJson = {
  checkErrorsMode: "onValueChanged",
  pages: [
    /* ─────────────────────────────  1 ▸ COMPANY DETAILS  ───────────────────────────── */
    {
      name: "company-details",
      title: "Company Details",
      elements: [
        {
          type: "text",
          name: "userEmail",
          title: "Your Email",
          titleLocation: "top",
          readOnly: true,
          startWithNewLine: false,
          isRequired: true,
        },
        {
          type: "text",
          name: "userUniqueId",
          readOnly: true,
          visible: false,
        },
        {
          type: "text",
          name: "userId",
          readOnly: true,
          visible: false,
        },
        {
          type: "text",
          name: "name",
          title: "Company Name",
          titleLocation: "top",
          isRequired: true,
          placeholder: "Enter the name of your company",
        },

        {
          type: "text",
          name: "telephone", // NEW ① tel field
          title: "Telephone",
          inputType: "tel",
          startWithNewLine: false,
          minWidth: "256px",
          placeholder: "+44 20 7946 0018",
          // Simple UK‑style number pattern – tweak as needed
          validators: [
            {
              type: "regex",
              regex: "^\\+?[0-9\\s()\\-]{7,15}$",
              text: "Please enter a valid phone number",
            },
          ],
        },
        {
          type: "dropdown",
          name: "sectorId",
          title: "Sector",
          titleLocation: "top",
          minWidth: "192px",
          isRequired: true,
          placeholder:
            "Select the primary sector in which this business operates",
          allowClear: true,
          choicesByUrl: {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/surveyjs/selectItems?type=sector`,
            path: "sector",
            valueName: "value",
            titleName: "label",
          },
        },
        {
          type: "dropdown",
          name: "regionId",
          minWidth: "192px",
          title: "Region",
          titleLocation: "top",
          isRequired: true,
          searchEnabled: false,
          placeholder: "Select the region in which this business operates",
          allowClear: true,
          choicesByUrl: {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/surveyjs/selectItems?type=region`,
            path: "region",
            valueName: "value",
            titleName: "label",
          },
        },
        {
          type: "dropdown",
          name: "businessTypeId",
          title: "Business Type",
          titleLocation: "top",
          minWidth: "192px",
          isRequired: true,
          placeholder: "Select the business type of this business",
          allowClear: true,
          choicesByUrl: {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/surveyjs/selectItems?type=business_type`,
            path: "business_type",
            valueName: "value",
            titleName: "label",
          },
        },
        {
          type: "text",
          name: "companyNumber",
          title: "Company Number",
          titleLocation: "top",
          defaultValue: "10101010",
          startWithNewLine: false,
          visibleIf: "{businessTypeId} = 3",
          placeholder: "Not required right now if you are unsure",
        },
        {
          type: "text",
          name: "sicCode",
          title: "SIC Code",
          titleLocation: "top",
          defaultValue: "10101",
          startWithNewLine: false,
          visibleIf: "{businessTypeId} = 3",
          placeholder: "Not required right now if you are unsure",
        },
        {
          type: "dropdown",
          name: "companySizeId",
          minWidth: "256px",
          title: "Company Size",
          titleLocation: "top",
          isRequired: true,
          allowClear: true,
          placeholder: "Select Company Size",
          choicesByUrl: {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/surveyjs/selectItems?type=company_size`,
            path: "company_size",
            valueName: "value",
            titleName: "label",
          },
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
              /* unchanged expression */
              expression:
                "({companySizeId} = 51 and {numberOfEmployees} <= 10) or ({companySizeId} = 52 and {numberOfEmployees} > 10 and {numberOfEmployees} <= 50) or ({companySizeId} = 53 and {numberOfEmployees} > 51 and {numberOfEmployees} <= 250) or ({companySizeId} = 54 and {numberOfEmployees} > 250)",
            },
          ],
          placeholder: "Enter the number of current Employees",
        },
      ],
    },

    /* ─────────────────────────────  2 ▸ COMPANY SITES  ───────────────────────────── */
    {
      name: "customer-sites",
      title: "Company Sites",
      elements: [
        {
          type: "paneldynamic",
          name: "customerSites",
          title:
            "Enter your company locations below. (First being the primary location of your organisation)",
          panelCount: 1,
          maxPanelCount: 3,

          // ←–– Enforce unique siteName across all panels
          keyName: "siteName",
          keyDuplicationError: "Each site name must be unique",

          templateElements: [
            /* ───────── always shown ───────── */
            {
              type: "text",
              name: "siteName",
              title: "Site Name",
              isRequired: true,
              placeholder: "e.g. Head Office",
            },
            {
              type: "dropdown",
              name: "siteTypeId",
              startWithNewLine: false,
              title: "Site Type",
              titleLocation: "top",
              isRequired: true,
              renderAs1: "select",
              placeholder: "What type of site is this",
              allowClear: true,
              choicesByUrl: {
                url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/surveyjs/selectItems?type=site_type`,
                path: "site_type",
                valueName: "value",
                titleName: "label",
              },
            },
            {
              type: "text",
              name: "address1",
              title: "No. / Name & Street",
              minWidth: "256px",
              isRequired: true,
              placeholder: "No. / Name & Street",
            },
            {
              type: "text",
              name: "postcode",
              title: "Postcode",
              minWidth: "256px",
              isRequired: true,
              placeholder: "Postcode",
            },
            {
              type: "dropdown",
              name: "country",
              title: "Country",
              minWidth: "256px",
              startWithNewLine: false,
              allowClear: true,
              choicesOrder: "asc",
              isRequired: true,
              choicesByUrl: {
                url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/surveyjs/selectItems?type=country`,
                path: "country",
                valueName: "value",
                titleName: "label",
              },
            },
          ],
        },
      ],
    },

    /* ─────────────────────────────  3 ▸ COMPANY DEPARTMENTS  ─────────────────────── */
    {
      name: "company-departments",
      title: "Company Departments",
      elements: [
        {
          type: "paneldynamic",
          name: "departments",
          title:
            "Add up to 2 additional departments inside the organisation. We have added one main departnent for you (which you will be a part of).",
          panelCount: 0,
          minPanelCount: 0,
          maxPanelCount: 2,
          renderMode: "list",

          // ←–– Enforce unique departmentName across panels
          keyName: "departmentName",
          keyDuplicationError: "Each department name must be unique",

          templateElements: [
            {
              type: "text",
              name: "departmentName",
              title: "Department Name",
              isRequired: true,
              placeholder: "e.g. Sales",
            },
            {
              type: "comment",
              name: "departmentDescription",
              title: "Description",
              placeholder: "What does this department do?",
            },
            /* hidden flag required by backend */
            {
              type: "boolean",
              name: "isDepartment",
              defaultValue: true,
              visible: false,
            },
          ],
        },
      ],
    },

    /* ─────────────────────────────  4 ▸ COMPANY STAFF  ───────────────────────────── */
    {
      name: "company-staff-section",
      title: "Invite Your Company Staff",
      elements: [
        {
          type: "boolean",
          name: "inviteStaff",
          title: "Would you like to invite your staff to join the platform?",
          labelTrue: "Yes",
          labelFalse: "Not right now",
          defaultValue: true,
          isRequired: true,
        },
        {
          type: "boolean",
          name: "useBulkEntry",
          title: "How would you like to add your staff’s email addresses?",
          labelTrue: "Paste all at once",
          labelFalse: "Enter individually",
          visibleIf: "{inviteStaff} = true",
          defaultValue: false,
          description:
            "Choose “Enter individually” to type or paste one email at a time (up to 19). " +
            "Or choose “Paste all at once” to drop in a comma-separated list.",
        },
        {
          type: "paneldynamic",
          name: "companyStaff",
          title:
            "Enter up to 19 of your staff. They will be invited to join the platform.",
          panelCount: 1,
          maxPanelCount: 19,
          renderMode: "list",
          visibleIf: "{useBulkEntry} = false and {inviteStaff} = true",
          minPanelCount: 0,
          isRequired: true,

          keyName: "staffEmail",
          keyDuplicationError: "Each email address must be unique",

          templateElements: [
            {
              type: "text",
              name: "staffEmail",
              title: "Staff Email",
              inputType: "email",
              isRequired: true,
              placeholder: "name@example.com",
              validators: [
                { type: "email", text: "Please enter a valid email address" },
              ],
            },
          ],
        },
        {
          type: "text",
          name: "companyStaffBulk",
          title: "Paste up to 19 emails, separated by commas",
          visibleIf: "{useBulkEntry} = true and {inviteStaff} = true",
          inputType: "textarea",
          textUpdateMode: "onTyping",
          autoGrow: true,
          minRows: 3,
          minHeight: "200px",
          isRequired: true,
          placeholder:
            "e.g. alice@example.com, bob@example.com, charlie@example.com",
            validators: [
              // 1) FORMAT CHECK: each chunk must look like an email
              {
                type: "regex",
                regex:
                  "^(?:\\s*[^,\\s]+@[^,\\s]+\\.[^,\\s]+\\s*)(?:,\\s*[^,\\s]+@[^,\\s]+\\.[^,\\s]+\\s*)*$",
                text: "Please enter valid email addresses, separated by commas."
              },
              // 2) COUNT CHECK: disallow 20th comma (i.e. max 18 commas → 19 items)
              {
                type: "regex",
                regex: "^(?!(?:.*?,){19}).*$",
                text: "You can only paste up to 19 email addresses."
              }
            ]
        },
      ],
    },

    // Tool selection -- no longer used in the form, but kept here for reference
    /* ─────────────────────────────  5 ▸ TOOL SELECTION  ──────────────────────────── */
    // {
    //   name: "tool-selection",
    //   title: "Tool Selection",
    //   width: "100%",
    //   elements: [
    //     {
    //       type: "boolean",
    //       name: "x",
    //       title: "Do you want to add staff members?",
    //     },
    //     {
    //       type: "paneldynamic",
    //       name: "toolPanels",
    //       title: "Select the tools you'd like to use",
    //       width: "100%",

    //       setValueIf: "{x}=true",
    //       isrequired: true,
    //       setValueExpression:
    //       "perygonApiRequest('/toolConfig/allBy', 'showInSeeMoreList=true', 'displayName:displayName|iconImageUrl:iconImageUrl|previewText:previewText|isTrialable:isTrialable')",
    //       templateElements: [
    //         {
    //           type: "text",
    //           name: "displayName",
    //           title: "Tool Name",
    //           titleLocation: "hidden",
    //           width: "80%",
    //         },
    //         {
    //           type: "image",
    //           width: "20%",
    //           minWidth: "224px",
    //           imageLink: "{panel.iconImageUrl}",
    //           imageFit: "cover",
    //           imageHeight: "175px",
    //           autoGrow: true,
    //         },
    //         {
    //           type: "comment",
    //           name: "previewText",
    //           title: "About this tool",
    //           titleLocation: "hidden",
    //           width: "80%",
    //           height: "200px",
    //           allowResize: false,
    //           autoGrow: true,
    //           startWithNewLine: false,
    //         },
    //         {
    //           type: "boolean",
    //           name: "useTool",
    //           title: "Use this tool?",
    //           labelTrue: "Yes",
    //           labelFalse: "No",
    //           defaultValue: false,
    //           enableIf: "{panel.isTrialable} = true",
    //         },
    //         {
    //           type: "html",
    //           name: "unavailableMsg",
    //           html: "<em>This tool is unavailable on your current plan.</em>",
    //           visibleIf: "{panel.isTrialable} = false",
    //           allowResize: false,
    //           autoGrow: true,
    //         },
    //       ],
    //       allowAddPanel: false,
    //       allowRemovePanel: false,
    //     },
    //   ],
    // }
  ],
};
