import React from "react";
import { Box, Text } from "@chakra-ui/react";

interface SearchParams {
  l?: string;
}

const Page = ({ searchParams }: { searchParams: SearchParams }) => {
  return (
    <Box mt={"65px"}>
      This is a link page <br />
      <Text color={"white"}>{searchParams.l || "No link provided"}</Text>
    </Box>
  );
};

export default Page;
