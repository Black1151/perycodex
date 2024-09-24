import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import {customerFields} from "@/components/agGrids/dataFields/customerFields";

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
    const res = await fetch(`${process.env.BE_URL}/customer/allBy?selectColumns=id,name,customerCode,isActive,uniqueId`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    });

    console.log(res);

    if (!res.ok) {
        return redirect("/error");
    }


    const customers = await res.json();
    const customerData = customers.resource;

    // Check if customerData exists and has data
    if (customerData && customerData.length > 0) {
        return (
            <>
                <DataGridComponent data={customerData} initialFields={customerFields} createNewUrl={'/customers/create'}/>
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
