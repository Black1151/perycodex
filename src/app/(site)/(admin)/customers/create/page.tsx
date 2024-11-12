import { customerJson } from "@/components/surveyjs/forms/customer";
import AdminHeader from "@/components/AdminHeader";
import SurveyComponent from "@/components/surveyjs/SurveyComponent";
import { checkUserRole } from "@/lib/dal";

export default async function CustomersCreatePage() {
  await checkUserRole(`/customers/create`);

  return (
    <>
      <AdminHeader headingText={"Create Customer"} />
      <SurveyComponent
        surveyJson={customerJson}
        endpoint={"/customer"}
        isNew={true}
        layout={"default"}
        excludeKeys={["imageUrl"]}
        redirectUrl={"/customers"}
        sjsPath={"admin"}
      />
    </>
  );
}
