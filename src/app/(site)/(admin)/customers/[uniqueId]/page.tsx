import { CustomerDetailsBanner } from "@/components/AdminDetailsBanners/CustomerDetailsBanner";
import { customerJson } from "@/components/surveyjs/forms/customer";
import { redirect } from "next/navigation";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import { getUserIdentity } from "@/lib/getUserIdentity";
import { checkUserRole } from "@/lib/checkUserRole";
import apiClient from "@/lib/apiClient";

export default async function CustomersDetailsPage({
  params,
}: {
  params: { uniqueId: string };
}) {
  const userIdentity = await getUserIdentity();

  checkUserRole(userIdentity, `/customers/${params.uniqueId}`);

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
        dataset={customerData}
        excludeKeys={["imageUrl"]}
        layout={"default"}
        sjsPath={"admin"}
        reloadPageOnSuccess={true}
      />
    </div>
  );
}
