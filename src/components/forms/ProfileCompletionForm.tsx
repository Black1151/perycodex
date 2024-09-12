"use client";

import { useForm, SubmitHandler, FieldError } from "react-hook-form";
import { Button, VStack, useTheme, useToast } from "@chakra-ui/react";
import { DropdownOption, InputField } from "./InputField";
import axios from "axios";
import { useRouter } from "next/navigation";
import { phoneNumberValidation } from "./validationSchema/validationSchema";

export type ProfileCompletionFormInputs = {
  titleId: string;
  firstName: string;
  lastName: string;
  mobile: string;
  jobTitle: string;
  siteId: string;
  departmentId: string;
  teamId: string;
  contractId: string;
  jobLevelId: string;
  employStartDate: string;
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
    contractId?: FieldError;
    jobLevelId?: FieldError;
    employStartDate?: FieldError;
  };
  dropdowns: {
    title: DropdownOption[];
    job_type: DropdownOption[];
    role_type: DropdownOption[];
    team: DropdownOption[];
    dept: DropdownOption[];
  };
}

export function ProfileCompletionForm({
  isSubmitting,
  dropdowns,
}: ProfileCompletionFormProps) {
  const theme = useTheme();
  const toast = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<ProfileCompletionFormInputs>();

  const handleFormSubmit: SubmitHandler<ProfileCompletionFormInputs> = async (
    formData
  ) => {
    console.log(formData);

    try {
      const updatedData = {
        ...formData,
        isProfileRegistered: true,
      };

      const response = await axios.put("/api/user/updateUserDetails", {
        data: updatedData,
      });

      if (response.status === 200) {
        router.push("/");
      }
    } catch (error: any) {
      console.log("GGG", error);

      const errorMessage =
        error.response?.data?.error || "Please contact administrator";

      toast({
        title: "Sorry there was an error with the form",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
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
            placeholder="Select Title"
            type="select"
            options={dropdowns.title}
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
            placeholder="First Name"
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
            placeholder="Surname"
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
            placeholder="Mobile"
            type="text"
            error={formErrors.mobile}
            register={() => register("mobile", phoneNumberValidation)}
            focusBorderColor={theme.colors.perygonPink}
          />

          <InputField
            name="jobTitle"
            placeholder="Job Title"
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
            placeholder="Main Office Site"
            type="select"
            error={formErrors.siteId}
            options={[{ value: 1, label: "dummy site" }]}
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
            options={dropdowns.dept}
            error={formErrors.departmentId}
            register={() =>
              register("departmentId", {
                required: "Department is required",
              })
            }
            focusBorderColor={theme.colors.perygonPink}
          />

          <InputField
            name="teamId"
            placeholder="Select Team"
            type="select"
            options={[{ value: 18, label: "Dummy team" }]}
            error={formErrors.teamId}
            register={() =>
              register("teamId", {
                required: "Team is required",
              })
            }
            focusBorderColor={theme.colors.perygonPink}
          />

          <InputField
            name="contractId"
            placeholder="Select Contract Type"
            type="select"
            options={dropdowns.job_type}
            error={formErrors.contractId}
            register={() =>
              register("contractId", {
                required: "Contract type is required",
              })
            }
            focusBorderColor={theme.colors.perygonPink}
          />

          <InputField
            name="jobLevelId"
            placeholder="Select Job Level"
            type="select"
            options={dropdowns.role_type}
            error={formErrors.jobLevelId}
            register={() =>
              register("jobLevelId", {
                required: "Job level is required",
              })
            }
            focusBorderColor={theme.colors.perygonPink}
          />

          <InputField
            name="employStartDate"
            placeholder="Employment Start Date"
            type="date"
            error={formErrors.employStartDate}
            register={() =>
              register("employStartDate", {
                required: "Employment start date is required",
              })
            }
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
