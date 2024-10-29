import { Box, HStack } from "@chakra-ui/react";
import BottomNavigationMenuItem, { MenuItem } from "./BottomNavigationMenuItem";

interface BottomNavigationMenuProps {
  menuItems: MenuItem[];
}

export function BottomNavigationMenu({ menuItems }: BottomNavigationMenuProps) {
  return (
    <Box
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      bg="white"
      boxShadow="xl"
      zIndex={5}
      px={2}
      display={["block", "block", "none"]}
    >
      <HStack
        spacing={4}
        justify="space-around"
        alignItems="flex-start"
        overflowX="auto"
        css={{
          "&::-webkit-scrollbar": { display: "none" },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {menuItems.map((menuItem) => (
          <BottomNavigationMenuItem key={menuItem.label} menuItem={menuItem} />
        ))}
      </HStack>
    </Box>
  );
}

export default BottomNavigationMenu;
