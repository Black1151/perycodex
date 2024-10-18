import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// AG Grids
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import { customerFields } from "@/components/agGrids/dataFields/customerFields";
import AdminHeader from "@/components/AdminHeader";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

interface SearchParams {
  customerType?: string;
}

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;
  const uniqueId = cookieStore.get("user_uuid")?.value;

  if (!authToken) {
    return redirect("/login");
  }

  // Fetch user data
  let userIdentity = null;

  try {
    const identityResponse = await fetch(
      `${process.env.BE_URL}/getView?view=vwLoggedInUserIdentity&userUniqueId=${uniqueId}&selectColumns=customerId,role,userImageUrl,firstName`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (!identityResponse.ok) {
      throw new Error("Failed to fetch user identity");
    }

    userIdentity = (await identityResponse.json()).resource;
  } catch (error) {
    console.error("Error fetching user identity:", error);
    return redirect("/error");
  }

  let url = `${process.env.BE_URL}/getAllView?view=vwCustomersList&selectColumns=id,name,custId,address3,country,customerCode,numberOfEmployees,imageUrl,isActive,noOfUsers,noOfSites,sectorName,customerType`;
  let headerTitle = "Customers";
  let customerTypeParam = searchParams.customerType;

  // Dynamically apply filters based on the role and customerTypeParam
  if (userIdentity.role === "CA") {
    // Default customerTypeParam to 'internal' if it's not 'internal' or 'external'
    if (!["external"].includes(customerTypeParam || "")) {
      customerTypeParam = "external";
      headerTitle = "Our Clients";
    } else if (customerTypeParam === "external") {
      headerTitle = "Our Clients";
    }
  } else if (userIdentity.role === "PA") {
    headerTitle = "Customers";
    // No additional filters for PA, the base URL is sufficient
  }

  // Fetch customer data from the backend
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!res.ok) {
    return redirect("/error");
  }

  const customers = await res.json();
  const customerData = customers.resource;

  // Check if customerData exists and has data
  const customerCount = customerData ? customerData.length : 0;

  // Check if customerData exists and has data
  if (customerData && customerCount > 0) {
    return (
      <>
        <AdminHeader headingText={headerTitle} dataCount={customerCount} />
        <DataGridComponent
          data={customerData}
          initialFields={customerFields}
          createNewUrl={"/customers/create"}
        />
      </>
    );
  } else {
    return (
      <>
        <h1>No Customers Found</h1>
      </>
    );
  }
}
