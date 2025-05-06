import React from "react";
import RegisterCompany from "./RegisterCompany";
import { registerCustomerJson } from "@/components/surveyjs/forms/registerCompany";
import { getUser, checkUserRole } from "@/lib/dal";
import apiClient from "@/lib/apiClient";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function RegisterCompanyPage({
  params,
}: {
  params: { uniqueId: string };
}) {

  return (
    <div>
      <RegisterCompany
        registerCustomerJson={registerCustomerJson}
      />
    </div>
  );
}
