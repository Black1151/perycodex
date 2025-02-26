"use client";

import React, {useMemo, useState} from "react";
import {BlurOn, ContentCopy} from "@mui/icons-material";
import AssignGroupModal from "./AssignGroupModal";
import {useUser} from "@/providers/UserProvider";
import NavigationSidebar, {MenuItem} from "@/components/Sidebars/NavigationSidebar/NavigationSidebar";

const UserGroupDrawerComponent: React.FC = () => {
    const {user} = useUser();

    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const openModal = (): void => setModalOpen(true);
    const closeModal = (): void => setModalOpen(false);

    const generateMenuItems = (userRole: string | null): MenuItem[] => {
        if (userRole === "PA") {
            return [
                {
                    label: "Assign to Customer",
                    icon: <ContentCopy sx={{height: "100%", width: "100%"}}/>,
                    onClick: openModal,
                    category: "External",
                },
            ];
        }
        return [];
    };

    // Memoize the menu items for performance optimization
    const menuItems: MenuItem[] = useMemo(
        () => generateMenuItems(user?.role ?? null),
        [user?.role],
    );

    return (
        <>
            {/* Right-hand navigation drawer */}
            <NavigationSidebar
                initialState="closed"
                menuItems={menuItems}
                openButtonIcon={BlurOn}
                side={'right'}
            />

            {/* Modal for assigning user groups */}
            <AssignGroupModal isOpen={isModalOpen} onClose={closeModal}/>
        </>
    );
};

export default UserGroupDrawerComponent;
