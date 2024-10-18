import { Heading, Text } from "@chakra-ui/react";

interface AdminHeadingProps {
    headingText: string;
    dataCount?: number;
}

const AdminHeading: React.FC<AdminHeadingProps> = ({ headingText, dataCount }) => {
    return (
        <Heading as="h1" size="lg" color="white" width="full" borderBottom="1px solid white">
            {headingText}{" "}
            {dataCount &&
            <Text as="sup" size="sm">
                {dataCount}
            </Text>
            }
        </Heading>
    );
};

export default AdminHeading;