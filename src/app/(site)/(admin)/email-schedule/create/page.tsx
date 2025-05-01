import AdminHeader from "@/components/AdminHeader";

import { emailScheduleJson } from "@/components/surveyjs/forms/emailSchedule";
import { checkUserRole } from "@/lib/dal";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";

export default async function EmailTemplateCreatePage() {
  await checkUserRole("/email-schedule/create");

  return (
    <>
      <AdminHeader headingText="Create Email Schedule" />
      <AdminFormWrapper
        formJson={emailScheduleJson}
        data={null}
        layoutConfig={{
          layoutKey: "default",
          layoutProps: {},
        }}
        globalVariables={[]}
        stylingConfig={{
          sjsFilePath: "admin",
          cssFilePath: "admin",
        }}
        jsImport={""}
        excludeKeys={[]}
        endpoint={`/emailSchedule`}
        formSuccessMessage={null}
        reloadPageOnSuccess={false}
        redirectUrl={"/dashboards"}
        isNew={true}
        isAllowedToEdit={true}
      />
    </>
  );
}
