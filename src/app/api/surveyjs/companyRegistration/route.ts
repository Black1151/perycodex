import apiClient from "@/lib/apiClient";
import { NextResponse } from "next/server";

interface CompanyData {
  name: string;
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
      const siteEmail = "defaultSiteEmail@gmail.com"
  
      const companyPayload = {
        "isActive": true,
        "multiSite": hasMultipleSites,
        "country": data.customerSites[0].country,
        "siteCountry": data.customerSites[0].country,
        "name": data.name,
        "sectorId": data.sectorId,
        "regionId": data.regionId,
        "companySizeId": data.companySizeId,
        "numberOfEmployees": data.numberOfEmployees,
        //companyLogo: data.companyLogo,
        "address1": data.customerSites[0].address1,
        "postcode": data.customerSites[0].postcode,
        "siteName": data.customerSites[0].siteName,
        "siteEmail": siteEmail,
      };

      console.log("Company payload:", companyPayload);
  
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

      console.log("Company created successfully:", companyRes);
  
    //   const { companyId } = await companyRes.json();
  
    //   // 2. Map other payloads with companyId included
    //   const sitePayloads = data.customerSites.map(site => ({
    //     ...site,
    //     companyId,
    //   }));
  
    //   const departmentPayloads = data.departments.map(dept => ({
    //     name: dept.departmentName,
    //     description: dept.departmentDescription,
    //     isDepartment: dept.isDepartment,
    //     companyId,
    //   }));
  
    //   const staffPayloads = data.companyStaff.map(staff => ({
    //     email: staff.staffEmail,
    //     companyId,
    //   }));
  
    //   const toolPayloads = data.selectedTools.map(tool => ({
    //     toolId: tool.id,
    //     companyId,
    //   }));
  
    //   // 3. POST to other endpoints
    //   await Promise.all([
    //     fetch("https://your-api.com/api/sites", {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify(sitePayloads),
    //     }),
    //     fetch("https://your-api.com/api/departments", {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify(departmentPayloads),
    //     }),
    //     fetch("https://your-api.com/api/staff", {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify(staffPayloads),
    //     }),
    //     fetch("https://your-api.com/api/tools", {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify(toolPayloads),
    //     }),
    //   ]);
  
      return NextResponse.json({ message: "Company and related data created successfully." });
    } catch (error) {
      console.error("Error submitting data:", error);
      return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
  }
  
