import apiClient from "@/lib/apiClient";
import { NextResponse } from "next/server";

interface CompanyData {
  name: string;
  primaryEmail: string;
  userUniqueId: string;
  telephone: string;
  sectorId: number;
  regionId: number;
  companySizeId: number;
  numberOfEmployees: number;
  companyLogo: string | null;
  customerSites: {
    siteName: string;
    address1: string;
    postcode: string;
    country: number;
  }[];
  departments: {
    isDepartment: boolean;
    departmentName: string;
    departmentDescription: string;
  }[];
  companyStaff: {
    staffEmail: string;
  }[];
  selectedTools: {
    id: number;
  }[];
}

export async function POST(req: Request) {
  try {
    const data: CompanyData = await req.json();

    const hasMultipleSites = data.customerSites.length > 1;
    const primarySite = data.customerSites[0];

    const businessTypeId = 4; //TODO: Add this in?

    const companyPayload = {
      isActive: true,
      multiSite: hasMultipleSites,
      country: "GB", //Primary site is currently in number, need to change to country code
      siteCountry: "GB", //Primary site is currently in number, need to change to country code
      name: data.name,
      businessTypeId: businessTypeId,
      sectorId: data.sectorId,
      regionId: data.regionId,
      companySizeId: data.companySizeId,
      numberOfEmployees: data.numberOfEmployees,
      address1: primarySite.address1,
      address2: "", //Address2 is not provided in the data, leave empty
      address3: "", //Address3 is not provided in the data, leave empty
      address4: "", //Address4 is not provided in the data, leave empty
      postcode: primarySite.postcode,
    };

    //TODO: add primary user to primary site

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

    // Get the company ID from the response for use in the next calls
    const companyId = responseBody.resource.id;

    console.log("Company response body:", responseBody); // Log the entire response body to the console

    // Get the users unique ID from the response
    const userUniqueId = data.userUniqueId;
    console.log("User unique ID:", userUniqueId); // Log the user unique ID to the console

    //2. Associate the logged in user with the new company
    const primaryUserPayload = {
      customerId: companyId,
      role: "CA"
    };

    const userRes = await apiClient(`/user/${userUniqueId}`, {
      method: "PUT",
      body: JSON.stringify(primaryUserPayload),
    });

    if (!userRes.ok) {
      console.log("Failed Body:", JSON.stringify(primaryUserPayload));
      const errorData = await userRes.json();
      console.error("Error details:", errorData);
      throw new Error("Failed to associate user with company");
    } else {
        console.log("User associated with company successfully:", await userRes.json());
    }

    // 3. Now we have companyId, we can create the other payloads...
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

    const toolPayloads = data.selectedTools.map((tool) => ({
      toolConfigId: tool.id,
      customerId: companyId,
      subscriptionTypeId: 1, // 1 = "Free Trial"
      price: 0,
      subStartDate: new Date().toISOString().split("T")[0], // Format: YYYY-MM-DD
    }));

    // 3. POST to other endpoints via apiClient
    const promises = [
      // 1. one promise per sitePayload
      ...sitePayloads.map(async (payload) => {
        const res = await apiClient("/site", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          console.error("Failed to post site:", await res.text());
          throw new Error("Failed to post site");
        } else {
          console.log("Site created successfully:", await res.json());
        }
        return res;
      }),

      // 2. multiple calls for each department
      ...departmentPayloads.map(async (payload) => {
        const res = await apiClient("/userTeam", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          console.error("Failed to post departments:", await res.text());
          throw new Error("Failed to post departments");
        } else {
          console.log("Department created successfully:", await res.json());
        }
        return res;
      }),

      // 3. Multiple calls for staff invites
      ...staffInvitePayloads.map(async (payload) => {
        const res = await apiClient("/registerByInvite", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          console.error("Failed to post staff invites:", await res.text());
          throw new Error("Failed to post staff invites");
        } else {
          console.log("Staff invite sent successfully:", await res.json());
        }
        return res;
      }),

      // 4. multiple calls, one for each tool
      ...toolPayloads.map(async (tool) => {
        const res = await apiClient("/toolCustomer", {
          method: "POST",
          body: JSON.stringify(tool),
        });
        if (!res.ok) {
          console.error("Failed to post tool:", await res.text());
          console.error("Errored Tool payload:", tool);
          throw new Error("Failed to post tools");
        } else {
          console.log("Tool added successfully:", await res.json());
        }
        return res;
      }),
    ];

    await Promise.all(promises);

    return NextResponse.json({
      message: "Company and related data created successfully.",
    });
  } catch (error) {
    console.error("Error submitting data:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
