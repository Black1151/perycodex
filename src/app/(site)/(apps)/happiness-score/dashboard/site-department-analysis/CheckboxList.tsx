import React from "react";
import { Box, Text, VStack, Checkbox } from "@chakra-ui/react";

interface CheckboxListProps {
    title: string;
    items: { id: number; name: string }[];
    selectedItems: number[];
    onChange: (id: number) => void;
}

const CheckboxList: React.FC<CheckboxListProps> = ({ title, items, selectedItems, onChange }) => {
    return (
        <Box border="1px solid" borderColor="gray.300" borderRadius="md" p={3} boxShadow="sm">
            <Text fontWeight="bold" mb={2}>{title}</Text>
            <VStack align="start" spacing={2} maxH="200px" overflowY="auto">
                {items.map((item) => (
                    <Checkbox key={item.id} isChecked={selectedItems.includes(item.id)} onChange={() => onChange(item.id)}>
                        {item.name}
                    </Checkbox>
                ))}
            </VStack>
        </Box>
    );
};

export default CheckboxList;
