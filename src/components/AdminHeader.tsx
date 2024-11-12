import { Heading, Text } from "@chakra-ui/react";

interface AdminHeadingProps {
  headingText: string;
  dataCount?: number;
}

const AdminHeading: React.FC<AdminHeadingProps> = ({
  headingText,
  dataCount,
}) => {
  return (
    <Heading
      as="h1"
      size="xl"
      color="white"
      width="full"
      fontFamily={"Bonfire"}
      fontWeight={100}
      borderBottom="1px solid white"
    >
      {headingText}{" "}
      {dataCount && (
        <Text as="sup" size="xs" fontFamily={"Metropolis"}>
          {dataCount}
        </Text>
      )}
    </Heading>
  );
};

export default AdminHeading;
