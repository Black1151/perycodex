import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import {customerFields} from "@/components/agGrids/dataFields/customerFields";
import AdminHeader from "@/components/AdminHeader";

// AG Grids
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function CustomersPage() {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth_token")?.value;

    if (!authToken) {
        return redirect("/login");
    }

    // Fetch customer data from the backend
    const res = await fetch(
        `${process.env.BE_URL}/customer/allBy?selectColumns=name,uniqueId,address3,country,customerCode,numberOfEmployees,imageUrl,isActive`,
        {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        }
    );

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
                <AdminHeader headingText={'CUSTOMERS'} dataCount={customerCount} />
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
