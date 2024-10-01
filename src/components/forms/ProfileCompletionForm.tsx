"use client";

import { useForm, SubmitHandler, FieldError } from "react-hook-form";
import { Button, VStack, useTheme, useToast } from "@chakra-ui/react";
import { DropdownOption, InputField } from "./InputField";
import { redirect, useRouter } from "next/navigation";
import { phoneNumberValidation } from "./validationSchema/validationSchema";
import { useState } from "react";

export type ProfileCompletionFormInputs = {
  titleId: string;
  firstName: string;
  lastName: string;
  mobile: string;
  jobTitle: string;
  siteId: string;
  departmentId: string;
  teamId: string;
  contractTypeId: string;
  jobLevelId: string;
};

interface ProfileCompletionFormProps {
  isSubmitting: boolean;
  errors: {
    titleId?: FieldError;
    firstName?: FieldError;
    lastName?: FieldError;
    mobile?: FieldError;
    jobTitle?: FieldError;
    siteId?: FieldError;
    departmentId?: FieldError;
    teamId?: FieldError;
    contractTypeId?: FieldError;
    jobLevelId?: FieldError;
  };
  dropdowns: {
    title: DropdownOption[];
    job_type: DropdownOption[];
    job_level: DropdownOption[];
    team: DropdownOption[];
    dept: DropdownOption[];
  };
  departmentsDropdown: DropdownOption[];
  sitesDropdown: DropdownOption[];
}

export function ProfileCompletionForm({
  isSubmitting,
  dropdowns,
  departmentsDropdown,
  sitesDropdown,
}: ProfileCompletionFormProps) {
  const theme = useTheme();
  const toast = useToast();
  const router = useRouter();

  const [teamOptions, setTeamOptions] = useState<DropdownOption[]>([]);
  const [isTeamsLoading, setIsTeamsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    setValue,
  } = useForm<ProfileCompletionFormInputs>();

  const handleFormSubmit: SubmitHandler<ProfileCompletionFormInputs> = async (
    formData
  ) => {
    try {
      const updatedData = {
        ...formData,
        isProfileRegistered: true,
      };

      console.log();

      const response = await fetch("/api/user/updateUserDetails", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: updatedData }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user details.");
      }

      router.push("/");
    } catch (error) {
      console.log(error);
      console.error(error);

      redirect("/error");
    }
  };

  const handleDepartmentChange = async (departmentId: string | number) => {
    setValue(
      "departmentId",
      typeof departmentId === "string" ? departmentId : departmentId.toString()
    );
    setIsTeamsLoading(true);

    try {
      const response = await fetch("/api/selectItems/fetchTeamsSelectItems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ departmentId }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch teams.");
      }

      const data = await response.json();

      const transformedTeams = data.resource.map(
        (team: { id: number; name: string }) => ({
          value: team.id,
          label: team.name,
        })
      );

      setTeamOptions(transformedTeams);
    } catch (error) {
      redirect("/error");
    } finally {
      setIsTeamsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      style={{ width: "100%", maxWidth: "md" }}
    >
      <VStack w={500} p={6}>
        <VStack spacing={4} w={300}>
          <InputField
            name="titleId"
            placeholder="Select Title *"
            type="select"
            options={dropdowns?.title}
            error={formErrors.titleId}
            register={() =>
              register("titleId", {
                required: "Title is required",
              })
            }
            focusBorderColor={theme.colors.perygonPink}
          />

          <InputField
            name="firstName"
            placeholder="First name *"
            type="text"
            error={formErrors.firstName}
            register={() =>
              register("firstName", {
                required: "First name is required",
              })
            }
            focusBorderColor={theme.colors.perygonPink}
          />

          <InputField
            name="lastName"
            placeholder="Surnames *"
            type="text"
            error={formErrors.lastName}
            register={() =>
              register("lastName", {
                required: "Surname is required",
              })
            }
            focusBorderColor={theme.colors.perygonPink}
          />

          <InputField
            name="mobile"
            placeholder="Mobile *"
            type="text"
            error={formErrors.mobile}
            register={() => register("mobile", phoneNumberValidation)}
            focusBorderColor={theme.colors.perygonPink}
          />

          <InputField
            name="jobTitle"
            placeholder="Job Title *"
            type="text"
            error={formErrors.jobTitle}
            register={() =>
              register("jobTitle", {
                required: "Job title is required",
              })
            }
            focusBorderColor={theme.colors.perygonPink}
          />

          <InputField
            name="siteId"
            placeholder="Select Main Office Site *"
            type="select"
            error={formErrors.siteId}
            options={sitesDropdown}
            register={() =>
              register("siteId", {
                required: "Main office site is required",
              })
            }
            focusBorderColor={theme.colors.perygonPink}
          />

          <InputField
            name="departmentId"
            placeholder="Select Department"
            type="select"
            options={departmentsDropdown}
            error={formErrors.departmentId}
            register={register}
            focusBorderColor={theme.colors.perygonPink}
            onChange={(value) => handleDepartmentChange(value)}
          />

          <InputField
            name="teamId"
            placeholder="Select Team"
            type="select"
            options={teamOptions}
            error={formErrors.teamId}
            register={() => register("teamId")}
            focusBorderColor={theme.colors.perygonPink}
            disabled={isTeamsLoading || teamOptions.length === 0}
          />

          <InputField
            name="contractTypeId"
            placeholder="Select Contract Type"
            type="select"
            options={dropdowns?.job_type}
            error={formErrors.contractTypeId}
            register={() => register("contractTypeId")}
            focusBorderColor={theme.colors.perygonPink}
          />

          <InputField
            name="jobLevelId"
            placeholder="Select Job Level"
            type="select"
            options={dropdowns?.job_level}
            error={formErrors.jobLevelId}
            register={() => register("jobLevelId")}
            focusBorderColor={theme.colors.perygonPink}
          />

          <Button
            mt={5}
            backgroundColor={theme.colors.perygonPink}
            type="submit"
            w="full"
            isLoading={isSubmitting}
            height={12}
            color="white"
            _hover={{
              color: theme.colors.perygonPink,
              border: `1px solid ${theme.colors.perygonPink}`,
              backgroundColor: "white",
            }}
          >
            Submit
          </Button>
        </VStack>
      </VStack>
    </form>
  );
}
