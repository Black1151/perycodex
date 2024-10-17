import DataGridComponent from "@/components/agGrids/DataGridComponent";
import {customerFields} from "@/components/agGrids/dataFields/customerFields";
import AdminHeader from "@/components/AdminHeader";
import {getUserIdentity} from "@/lib/getUserIdentity";
import apiClient from "@/lib/apiClient";
import {checkUserRole} from "@/lib/checkUserRole";
import {redirect} from "next/navigation";

interface SearchParams {
    customerType?: string
}

export default async function CustomersPage({searchParams}: { searchParams: SearchParams }) {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, "/customers");

    let url = `/getAllView?view=vwCustomersList&selectColumns=id,name,custId,address3,country,customerCode,numberOfEmployees,imageUrl,isActive,noOfUsers,noOfSites,sectorName,customerType`;
    let headerTitle = 'Customers';
    let customerTypeParam = searchParams.customerType;

    if (userIdentity.role === 'CA') {
        if (!['external'].includes(customerTypeParam || '')) {
            customerTypeParam = 'external';
            headerTitle = 'Our Clients';
        } else if (customerTypeParam === 'external') {
            headerTitle = 'Our Clients';
        }
    } else if (userIdentity.role === 'PA') {
        headerTitle = 'Customers';
    }

    const res = await apiClient(url);

    if (!res.ok) {
        return redirect("/error");
    }

    const customers = await res.json();
    const customerData = customers.resource;

    const customerCount = customerData ? customerData.length : 0;

    if (customerData && customerCount > 0) {
        return (
            <>
                <AdminHeader headingText={headerTitle} dataCount={customerCount}/>
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
