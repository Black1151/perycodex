"use client";

import React, {useState} from "react";
import {Box, useTheme, HStack} from "@chakra-ui/react";
import Bottombar, {BottombarProps} from "@/components/Bottombar/Bottombar";
import BottomNavigationMenuItem from "@/components/Bottombar/NavigationBottombar/BottomNavigationMenuItem";
import {MenuItem} from "@/components/Sidebars/NavigationSidebar/NavigationSidebar";

interface NavigationBottombarProps extends BottombarProps {
    menuItems: MenuItem[];
}

const NavigationBottombar: React.FC<NavigationBottombarProps> = ({menuItems, ...sidebarProps}) => {

    const [activeLabel, setActiveLabel] = useState<string | null>(null);

    const handleItemClick = (clicked: MenuItem) => {
        setActiveLabel(clicked.label);
        clicked.onClick?.();
    };

    const internalItems = menuItems.map((item) => ({
        ...item,
        active: item.label === activeLabel,
    }));

    const content = (
        <HStack
            justify={["flex-start", "space-between"]}
            alignItems="center"
            overflowX="auto"
            gap="10px"
            css={{
                "&::-webkit-scrollbar": {display: "none"},
                msOverflowStyle: "none",
                scrollbarWidth: "none",
                minWidth: "100%",
            }}
        >
            {internalItems.map((item, index) => (
                <Box key={index} minWidth="80px" h={'full'}>
                    {" "}
                    <BottomNavigationMenuItem
                        label={item.label}
                        icon={item.icon}
                        onClick={() => handleItemClick(item)}
                        active={item.active}
                        locked={item.locked}
                    />
                </Box>
            ))}
        </HStack>
    );

    return (
        <Bottombar
            {...sidebarProps}
            content={content}
        />
    );
};

export default NavigationBottombar;
