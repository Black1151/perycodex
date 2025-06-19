import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Text,
  Flex,
  List,
  ListItem,
  useTheme,
  useOutsideClick,
  Icon,
  HStack,
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Badge,
} from "@chakra-ui/react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
interface Category {
  id: number;
  name: string;
  points: number;
  giverPoints: number;
}

interface CustomCategoryDropdownProps {
  categories: Category[];
  value: string | number;
  onChange: (value: string | number) => void;
  isInvalid?: boolean;
  isRequired?: boolean;
  errorMessage?: string;
}

const CustomCategoryDropdown: React.FC<CustomCategoryDropdownProps> = ({
  categories,
  value,
  onChange,
  isInvalid,
  isRequired,
  errorMessage,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);

  useOutsideClick({
    ref,
    handler: () => setIsOpen(false),
  });

  const selected = categories.find((cat) => String(cat.id) === String(value));

  console.log("categories:", categories);

  return (
    <FormControl isInvalid={isInvalid} isRequired={isRequired}>
      <FormLabel color="white">Category</FormLabel>
      <Box ref={ref} position="relative">
        <Flex
          align="center"
          justify="space-between"
          bg="white"
          color="gray.800"
          borderRadius="md"
          borderWidth="1px"
          borderColor={isInvalid ? theme.colors.red[500] : "whiteAlpha.300"}
          px={4}
          py={2}
          cursor="pointer"
          _hover={{ borderColor: "whiteAlpha.400" }}
          onClick={() => setIsOpen((open) => !open)}
        >
          <>
            {selected ? (
              <HStack justifyContent="space-between" w="full">
                <Text textAlign="left" fontSize={"base"}>
                  {selected.name}
                </Text>
                <VStack w="min" gap={1}>
                  {selected.points && (
                    <Badge>{`+${selected.points} Receiver pts`}</Badge>
                  )}
                  {selected.giverPoints && (
                    <Badge>{`+${selected.giverPoints} Giver pts`}</Badge>
                  )}
                </VStack>
              </HStack>
            ) : (
              <Text>Choose a category...</Text>
            )}
          </>
          <Icon as={KeyboardArrowDownIcon} boxSize={5} color="gray.500" />
        </Flex>
        {isOpen && (
          <List
            position="absolute"
            zIndex={10}
            mt={1}
            w="100%"
            bg="white"
            color="gray.800"
            borderRadius="md"
            boxShadow="md"
            maxH="200px"
            overflowY="auto"
          >
            {categories.map((category, idx) => (
              <ListItem
                key={category.id}
                px={4}
                py={2}
                cursor="pointer"
                _hover={{ bg: theme.colors.gray[100] }}
                bg={
                  String(category.id) === String(value)
                    ? theme.colors.gray[200]
                    : ""
                }
                borderBottom={
                  idx !== categories.length - 1
                    ? `1px solid ${theme.colors.gray[200]}`
                    : undefined
                }
                onClick={() => {
                  onChange(category.id);
                  setIsOpen(false);
                }}
              >
                <HStack justifyContent="space-between" w="full">
                <Text textAlign="left" fontSize={"base"}>
                  {category.name}
                </Text>
                <VStack w="min" gap={1}>
                  {category.points && (
                    <Badge>{`+${category.points} Receiver pts`}</Badge>
                  )}
                  {category.giverPoints && (
                    <Badge>{`+${category.giverPoints} Giver pts`}</Badge>
                  )}
                </VStack>
              </HStack>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
      <FormErrorMessage>{errorMessage}</FormErrorMessage>
    </FormControl>
  );
};

export default CustomCategoryDropdown;
