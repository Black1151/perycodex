// getDidNotParticipate.ts
import apiClient from "@/lib/apiClient";

interface DidNotParticipateParams {
  workflowId: number;
  businessProcessId: number;
  toolConfigId: number;
  startDate: string;
  endDate: string;
}

export async function getDidNotParticipate({
  workflowId,
  businessProcessId,
  toolConfigId,
  startDate,
  endDate,
}: DidNotParticipateParams) {
  const response = await apiClient("/getUserHappinessParticipants", {
    method: "POST",
    body: JSON.stringify({
      scheduleId: 14,
      customerId: 1,
      toolConfigId,
      workflowId,
      businessProcessId,
      startDate,
      endDate,
    }),
  });

  return response.json();
}
