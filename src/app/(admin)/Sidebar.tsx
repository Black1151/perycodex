"use client";

import {VStack, Text, Divider, useTheme} from "@chakra-ui/react";
import {useRouter} from "next/navigation";
import {useUser} from "@/context/AdminUserContext";
import Link from "next/link";

interface SidebarItem {
    label: string;
    icon: React.ReactNode;
    path: string;
    action?: () => void;
    category: string;  // Grouping by category
}

interface SidebarProps {
    items: SidebarItem[];
}

export default function Sidebar({items}: SidebarProps) {
    const theme = useTheme();
    const router = useRouter();
    const {userRole} = useUser(); // Use the user context

    // Group items by category
    const groupedItems = items.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {} as Record<string, SidebarItem[]>);  // Using a Record to group by category

    return (
        <VStack
            align="start"
            spacing={4}
            width="250px"
            bg={theme.colors.gray[800]}
            color="white"
            p={4}
            flexShrink={1}
        >
            <Text>User Role: {userRole}</Text> {/* Display user role from context */}

            {Object.entries(groupedItems).map(([category, itemsInCategory], categoryIndex) => (
                <VStack key={categoryIndex} align="start" width="100%" spacing={4}>
                    {/* Optional: Category Title */}
                    <Text fontWeight="bold" color={theme.colors.gray[300]}>{category}</Text>

                    {itemsInCategory.map((item, index) => (
                        <Link href={item.path}>
                            <Text
                                key={index}
                                cursor="pointer"
                                _hover={{color: theme.colors.perygonPink}}
                                onClick={item.action ? item.action : () => router.push(item.path || '')}
                            >
                                {item.icon} {item.label}
                            </Text>
                        </Link>
                    ))}

                    {/* Add Divider after each category except the last one */}
                    {categoryIndex < Object.keys(groupedItems).length - 1 && (
                        <Divider borderColor={theme.colors.gray[600]}/>
                    )}
                </VStack>
            ))}
        </VStack>
    );
}
