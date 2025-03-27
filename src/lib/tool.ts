import apiClient from "@/lib/apiClient";

export async function checkToolAccess(toolId: string): Promise<boolean> {
  if (!toolId) return false;

  const res = await apiClient(`/api/toolConfig/${toolId}/check`, {
    method: "GET",
  });

  if (!res.ok) return false;

  const result = await res.json();
  return result.access === true;
}
