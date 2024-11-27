import { Flex, Heading, Text } from "@chakra-ui/react";

interface AdminHeadingProps {
  headingText: string;
  dataCount?: number;
}

const AdminHeading: React.FC<AdminHeadingProps> = ({
  headingText,
  dataCount,
}) => {
  return (
    <Flex color="white" width="full" borderBottom="1px solid white" gap={2}>
      <Heading as="h1" size="xl" fontFamily={"Bonfire"} fontWeight={100}>
        {headingText}{" "}
      </Heading>
      {dataCount && (
        <Text as="sup" size="xs">
          {dataCount > 0 ? dataCount : 0}
        </Text>
      )}
    </Flex>
  );
};

export default AdminHeading;
