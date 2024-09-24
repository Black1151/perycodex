import {cookies} from "next/headers";
import {redirect} from "next/navigation";

// AG Grids
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import {customerFields} from "@/components/agGrids/dataFields/customerFields";

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
    const res = await fetch(`${process.env.BE_URL}/customer/allBy?selectColumns=id,name,customer_code,is_active,uniqueId`, {
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
    if (customerData && customerData.length > 0) {
        return (
            <>
                <DataGridComponent data={customerData} initialFields={customerFields}
                                   createNewUrl={'/customers/create'}/>

                {/*<Heading mt={4}>Client Fetched Data with Server Route</Heading>*/}
                {/*<DataGridComponentClient endpoint={'api/customer/allBy'} initialFields={customerFields}*/}
                {/*                         createNewUrl={'/customers/create'}/>*/}
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
