import {
    Drawer, DrawerOverlay, DrawerContent, DrawerHeader,
    DrawerBody, Button, HStack, Text, Icon, VStack, Box,
    useDisclosure, useTheme, IconButton,
    Badge
} from "@chakra-ui/react";
import { KeyboardArrowDown, Check, Close as CloseIcon } from "@mui/icons-material";
import { transparentize } from "@chakra-ui/theme-tools";
import { ReactNode } from "react";

type Item = {
    id: string | number;
    label: string;
    isActive?: boolean;
};

type Props = {
    items: Item[];
    selectedId?: string | number;
    onSelect: (id: string | number) => void;
    triggerLabel?: ReactNode;
};

export default function MobileDrawerSelector({
    items,
    selectedId,
    onSelect,
    triggerLabel
}: Props) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const sel = items.find(i => i.id === selectedId);
    const theme = useTheme();
    const bg = theme.colors.elementBG;
    const borderColor = transparentize(theme.colors.primaryTextColor, 0.15)(theme);
    const successColor = theme.colors.green[500];
    const errorColor = theme.colors.red[500];
    const primaryTextColor = theme.colors.primaryTextColor;

    return (
        <>
            <Button
                width="100%"
                onClick={onOpen}
                rightIcon={<KeyboardArrowDown />}
                bg={bg}
                _hover={{ bg: transparentize(bg, 0.8)(theme) }}
                _active={{ bg: transparentize(bg, 0.9)(theme) }}
            >
                <HStack w="100%" justifyContent="space-between">
                    <Text flex="1" textAlign="left" isTruncated color={primaryTextColor}>
                        {triggerLabel ?? sel?.label ?? "Select…"}
                    </Text>

                    {sel && sel.isActive !== undefined && (
                        <Box
                            as="span"
                            display="inline-block"
                            w="12px"
                            h="12px"
                            borderRadius="full"
                            bg={sel.isActive ? successColor : errorColor}
                        />
                    )}
                </HStack>
            </Button>

            <Drawer placement="bottom" onClose={onClose} isOpen={isOpen} size="full">
                <DrawerOverlay />
                <DrawerContent bg={bg} borderTopRadius={theme.radii.md}>
                    <DrawerHeader
                        borderBottom="1px solid"
                        borderColor={borderColor}
                        fontWeight="medium"
                        p={4}
                    >
                        <HStack justifyContent="space-between" alignItems="center">
                            <Text color={primaryTextColor} fontWeight={"semibold"}>Choose an option</Text>
                            <IconButton
                                aria-label="Close drawer"
                                icon={<CloseIcon sx={{ fontSize: 28 }} />}
                                size="md"
                                variant="ghost"
                                color={primaryTextColor}
                                onClick={onClose}
                            />
                        </HStack>
                    </DrawerHeader>

                    <DrawerBody p={0}>
                        <VStack align="stretch" spacing={0} divider={
                            <Box borderBottom="1px solid" borderColor={borderColor} />
                        }>
                            {items.map(it => (
                                <Button
                                    key={it.id}
                                    justifyContent="space-between"
                                    variant="ghost"
                                    borderRadius={0}
                                    px={4} py={6}
                                    _hover={{ bg: transparentize(bg, 0.8)(theme) }}
                                    onClick={() => { onSelect(it.id); onClose(); }}
                                >
                                    <Text flex="1" textAlign="left" isTruncated color={primaryTextColor} fontWeight={"normal"}>{it.label}</Text>
                                    {it.isActive !== undefined && (
                                        it.isActive
                                            ? <Badge colorScheme="green">Active</Badge>
                                            : <Badge colorScheme="red">Inactive</Badge>
                                    )}
                                </Button>
                            ))}
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
}
