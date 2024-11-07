import apiClient from "@/lib/apiClient";
import { checkUserRole, getUser } from "@/lib/dal";
import { redirect } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import { customerFields } from "@/components/agGrids/dataFields/customerFields";

export const dynamic = "force-dynamic";

interface SearchParams {
  customerType?: string;
}

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const user = await getUser(); // Awaiting user data
  await checkUserRole("/customers");

  let url = `/getAllView?view=vwCustomersList&selectColumns=id,name,custId,customerCode,imageUrl,isActive,noOfUsers,noOfSites,sectorName,regionName,customerType`;
  let headerTitle = "Customers";
  let customerTypeParam = searchParams.customerType;

  // Role-based logic for setting customer type and header title
  ({ customerTypeParam, headerTitle } = getHeaderAndCustomerType(
    user.role,
    customerTypeParam
  ));

  const res = await apiClient(url, { cache: "no-store" });

  if (!res.ok) {
    return redirect("/error");
  }

  const customers = await res.json();
  const customerData = customers.resource || [];
  const customerCount = customerData.length;

  return (
    <>
      <AdminHeader headingText={headerTitle} dataCount={customerCount} />
      {customerCount > 0 ? (
        <DataGridComponent
          data={customerData}
          initialFields={customerFields}
          createNewUrl={"/customers/create"}
        />
      ) : (
        <h1>No Customers Found</h1>
      )}
    </>
  );
}

// Function to determine header title and customer type based on user role
function getHeaderAndCustomerType(role: string, customerTypeParam?: string) {
  let headerTitle = "Customers";
  if (role === "CA") {
    if (!["external"].includes(customerTypeParam || "")) {
      customerTypeParam = "external";
      headerTitle = "Our Clients";
    }
  } else if (role === "PA") {
    headerTitle = "Customers";
  }
  return { customerTypeParam, headerTitle };
}
