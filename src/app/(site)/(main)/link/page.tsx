import React from "react";
import { Box, Text } from "@chakra-ui/react";
import apiClient from "@/lib/apiClient";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/dal";

interface SearchParams {
  l?: string;
}

const LinkPage = async ({ searchParams }: { searchParams: SearchParams }) => {
  const session = await verifySession();

  // If there's no session, redirect to login
  if (!session) {
    redirect("/login");
  }

  let responseData = null;
  let error = null;

  if (!searchParams.l) {
    error = "No secure link provided.";
  } else {
    try {
      // Make the API call on the server side
      const response = await apiClient(`/emailSecureLinkRedirect`, {
        method: "POST",
        body: JSON.stringify({
          secureLink: searchParams.l,
        }),
      });

      console.log(response);

      if (!response.ok) {
        const errorData = await response.json();
        error = errorData?.message || "Failed to fetch data.";
      } else {
        const data = await response.json();
        responseData = data.resource || "No redirect URL returned.";
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      error = "An error occurred while fetching the data.";
    }
  }

  if (responseData) {
    redirect(responseData);
  }

  return (
    <Box mt="65px">
      <Text fontSize="xl">This is a link page</Text>
      <Text color="white">
        {error
          ? `Error: ${error}`
          : responseData
            ? `Redirect URL: ${responseData}`
            : "No data available."}
      </Text>
    </Box>
  );
};

export default LinkPage;
