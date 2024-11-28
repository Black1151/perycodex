import { CustomerDetailsBanner } from "@/components/AdminDetailsBanners/CustomerDetailsBanner";
import { customerJson } from "@/components/surveyjs/forms/customer";
import { redirect } from "next/navigation";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import { checkUserRole } from "@/lib/dal";
import apiClient from "@/lib/apiClient";

export default async function CustomersDetailsPage({
  params,
}: {
  params: { uniqueId: string };
}) {
  await checkUserRole(`/customers/${params.uniqueId}`);

  const res = await apiClient(`/customer/findBy?uniqueId=${params.uniqueId}`);

  if (!res.ok) {
    return redirect("/error");
  }

  const customer = await res.json();
  const customerData = customer.resource;

  return (
    <div>
      <CustomerDetailsBanner customer={customerData} />
      <SurveyComponent
        surveyJson={customerJson}
        endpoint={`/customer/${params.uniqueId}`}
        isNew={false}
        rolesCanEdit={["CA", "PA"]}
        dataset={customerData}
        excludeKeys={["imageUrl"]}
        layout={"default"}
        sjsPath={"admin"}
        reloadPageOnSuccess={true}
      />
    </div>
  );
}
