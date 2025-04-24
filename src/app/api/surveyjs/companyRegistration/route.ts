import apiClient from "@/lib/apiClient";
import { NextResponse } from "next/server";

interface CompanyData {
  name: string;
  primaryEmail: string;
  userUniqueId: string;
  userId: number;
  telephone: string;
  sectorId: number;
  regionId: number;
  businessTypeId: number;
  companySizeId: number;
  numberOfEmployees: number;
  companyLogo: string | null;
  customerSites: Site[];
  departments: Department[];
  companyStaff: {
    staffEmail: string;
  }[];
}

interface Site {
  siteName: string;
  address1: string;
  postcode: string;
  country: number;
}

interface Department {
  isDepartment: boolean;
  departmentName: string;
  departmentDescription: string;
}

export async function POST(req: Request) {
  try {
    const data: CompanyData = await req.json();
    const failedInvites: string[] = [];
    const successfulInvites: string[] = [];

    const hasMultipleSites = data.customerSites.length > 0; // Check if there are multiple sites (any sites sent through the form are additional)
    const primarySite = data.customerSites[0];

    const companyPayload = {
      isActive: true,
      multiSite: hasMultipleSites,
      country: "GB",      //TODO: Primary site is currently in number, need to change to country code
      siteCountry: "GB",  //TODO: Primary site is currently in number, need to change to country code
      name: data.name,
      businessTypeId: data.businessTypeId,
      sectorId: data.sectorId,
      regionId: data.regionId,
      primaryContactId: data.userId,
      companySizeId: data.companySizeId,
      numberOfEmployees: data.numberOfEmployees,
      address1: primarySite.address1,
      address2: "", //Address2 is not provided in the data, leave empty
      address3: "", //Address3 is not provided in the data, leave empty
      address4: "", //Address4 is not provided in the data, leave empty
      postcode: primarySite.postcode,
      isFree: true,
      parentId: null,
      //TODO: add is free until
    };

    // 1. Send company payload and get the new company ID
    const companyRes = await apiClient("/customer", {
      method: "POST",
      body: JSON.stringify(companyPayload),
    });

    if (!companyRes.ok) {
      const errorData = await companyRes.json();
      console.error("Error details:", errorData);
      throw new Error("Failed to create company");
    }

    const responseBody = await companyRes.json();

    console.log("Company created successfully:", responseBody);

    // Get the company ID from the response for use in the next calls
    const companyId = responseBody.resource.id;

    // Get the users unique ID from the response
    const userUniqueId = data.userUniqueId;

    //2. Associate the logged in user with the new company
    const primaryUserPayload = {
      customerId: companyId,
      role: "CA",
    };

    const userRes = await apiClient(`/user/${userUniqueId}`, {
      method: "PUT",
      body: JSON.stringify(primaryUserPayload),
    });

    if (!userRes.ok) {
      const errorData = await userRes.json();
      console.error("Error details:", errorData);
      throw new Error("Failed to associate user with company");
    }

    //3. Before we add the additional departments, we need to get the uid of the dept which was just created with the company
    //   This is the primary department, which the logged in user will be associated with

    const defaultDeptRes = await apiClient('/userTeam?customerId=' + companyId, {
      method: "GET",
    });

    if (!defaultDeptRes.ok) {
      const errorData = await defaultDeptRes.json();
      console.error("Error details:", errorData);
      throw new Error("Failed to get default department");
    }
    const defaultDeptBody = await defaultDeptRes.json();
    const defaultDeptId = defaultDeptBody.resource.id;

    // 4. Now we have companyId, we can create the other payloads...
    const sitePayloads = data.customerSites.map((site) => ({
      ...site,
      customerId: companyId,
      isActive: true,
      siteEmail: data.primaryEmail,
    }));

    const departmentPayloads = data.departments.map((dept) => ({
      name: dept.departmentName,
      description: dept.departmentDescription || null,
      customerId: companyId,
      isDepartment: true,
      isActive: true,
    }));

    const staffInvitePayloads = data.companyStaff.map((staff) => ({
      email: staff.staffEmail,
      customerId: companyId,
    }));

    const toolPayload = {
      customerId: companyId,
      toolConfigId: 1, //HAPPINESS
      subStartDate: new Date().toISOString().split("T")[0],
      subscriptionTypeId: 1, //FREE
      price: 0,
    };

    let primarySiteId: number | null = null;

    // 5. POST to other endpoints (not staff invites as if these fail it is not critical)
    const promises = [
      // 1. sites
      ...sitePayloads.map(async (payload, i) => {
        const res = await apiClient("/site", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          console.error("Failed to post site:", await res.text());
          throw new Error("Failed to post site");
        }
        // get the first site id to set as primary site
        if (i === 0) {
          const body = await res.json();
          primarySiteId = body.resource.id;
        }
        return res;
      }),

      // 2. multiple calls for each additional department
      ...departmentPayloads.map(async (payload) => {
        const res = await apiClient("/userTeam", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          console.error("Failed to post departments:", await res.text());
          throw new Error("Failed to post departments");
        }
        return res;
      }),

      // 3. generic tool payload... used for all free sign ups, they only get happiness
      (async () => {
        const toolRes = await apiClient(`/toolCustomer`, {
          method: "POST",
          body: JSON.stringify(toolPayload),
        });
        if (!toolRes.ok) {
          console.error("Failed to post tool:", await toolRes.text());
          throw new Error("Failed to post tools");
        }
        return toolRes;
      })(),
    ];

    const promisesRes = await Promise.all(promises);

    if (promisesRes.some((res) => !res.ok)) {
      // If any of the promises failed, we need to handle the error
      const errorMessages = promisesRes.map((res) => res.statusText);
      console.error("Error details:", errorMessages);
      throw new Error(
        "Failed to create company related data. Please try again."
      );
    }

    // 6. Now we can send the staff invites
    const invitePromises = staffInvitePayloads.map(async (payload) => {
      const res = await apiClient("/registerByInvite", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        failedInvites.push(payload.email);
      } else {
        successfulInvites.push(payload.email);
      }
      return res;
    });

    await Promise.all(invitePromises);

    //7. once all the above is done and successful, we add the company id to their record so they
    //   get redirected to home. 
    //   ALSO associate the user with the primary site and department

    const userSuccessPayload = {
      departmentId: defaultDeptId,
      siteId: primarySiteId,
      customerId: companyId,
      role: "CA",
    };

    const userSuccessRes = await apiClient(`/user/${userUniqueId}`, {
      method: "PUT",
      body: JSON.stringify(userSuccessPayload),
    });

    if (!userSuccessRes.ok) {
      const errorData = await userSuccessRes.json();
      console.error("Error details:", errorData);
      throw new Error("Failed to set primary user");
    }

    return NextResponse.json({
      message: "Company and related data created successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
