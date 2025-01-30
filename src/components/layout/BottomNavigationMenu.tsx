import {Box, HStack, useTheme} from "@chakra-ui/react";
import BottomNavigationMenuItem, {MenuItem} from "./BottomNavigationMenuItem";

interface BottomNavigationMenuProps {
    menuItems: MenuItem[];
}

export function BottomNavigationMenu({menuItems}: BottomNavigationMenuProps) {
    const theme = useTheme();

    return (
        <Box
            position="fixed"
            bottom={0}
            left={0}
            right={0}
            bg="white"
            maxH={'100px'}
            boxShadow="xl"
            zIndex={999}
            px={2}
            display={["block", "block", "none"]}
            overflowX="scroll"
            overflowY={"hidden"}
            borderBottom={`1px solid ${theme.colors.perygonPink}`}
            css={{
                WebkitOverflowScrolling: "touch",
                scrollbarHeight: "none",
                "-ms-overflow-style": "none",
                "&::-webkit-scrollbar": {
                    display: "none"
                }
            }}
        >
            <HStack
                justify="space-between"
                alignItems="flex-start"
                overflowX="auto"
                gap="10px"
                css={{
                    "&::-webkit-scrollbar": {display: "none"},
                    msOverflowStyle: "none",
                    scrollbarWidth: "none",
                    minWidth: "100%",
                }}
            >
                {menuItems.map((menuItem) => (
                    <Box key={menuItem.label} minWidth="80px">
                        {" "}
                        <BottomNavigationMenuItem menuItem={menuItem}/>
                    </Box>
                ))}
            </HStack>
        </Box>
    );
}

export default BottomNavigationMenu;
