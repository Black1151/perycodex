"use client";

import React, { useState, useEffect } from "react";
import { HStack, Box, useTheme } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

import ResetPasswordModal from "@/app/ResetPasswordModal";
import LogoDisplay from "./components/LogoDisplay";
import GreetingText from "./components/GreetingText";
import ProfileMenu from "./components/ProfileMenu";
import UserAvatar from "./components/UserAvatar";

import { useWorkflow } from "@/providers/WorkflowProvider";
import { useUser } from "@/providers/UserProvider";
import useNavMenuItems from "./hooks/useNavMenuItems";
import { useUnread } from "../contexts/UnreadRecognitionContext";

// For animations
const MotionBox = motion(Box);
const MotionHStack = motion(HStack);

export interface NavBarProps {
  userFirstName: string;
  userImageUrl: string;
  userRole: string;
}

const NavBar: React.FC<NavBarProps> = ({
  userFirstName,
  userImageUrl,
  userRole,
}) => {
  const router = useRouter();
  const { user } = useUser();
  const theme = useTheme();

  const { toolLogo, toolPath } = useWorkflow();
  const { unread, checkUnread } = useUnread();
  const [passwordResetModalOpen, setPasswordResetModalOpen] = useState(false);

  // Call checkUnread on mount so unread updates on load
  useEffect(() => {
    checkUnread();
  }, [checkUnread]);

  const openResetModal = () => setPasswordResetModalOpen(true);
  const handleOnClose = () => setPasswordResetModalOpen(false);

  const handleLogout = async () => {
    await fetch("/api/auth/sign-out", { method: "POST" });
    await signOut({ redirect: false });
    router.push("/login");
  };

  const menuItems = useNavMenuItems(userRole, handleLogout, openResetModal);

  return (
    <>
      <HStack
        gap={[5, 20]}
        px={[3, 3, 5]}
        width="100%"
        fontSize={[20, 40]}
        justifyContent="space-between"
        alignItems="center"
        height="60px"
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={100}
        bgGradient={theme.gradients.perygonBackground}
        borderBottom="white 1px solid"
      >
        <MotionBox
          initial={{ x: "-5vw", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          w="150px"
          display="flex"
        >
          <LogoDisplay
            userRole={userRole}
            toolLogo={toolLogo || undefined}
            toolPath={toolPath || undefined}
          />
        </MotionBox>

        <MotionHStack
          initial={{ x: "5vw", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          justifyContent="center"
          alignItems="center"
          gap={[2, 8]}
        >
          <GreetingText userFirstName={userFirstName} />
          <UserAvatar user={user} userRole={userRole} />
          <ProfileMenu
            userImageUrl={userImageUrl}
            menuItems={menuItems}
            unread={unread}
          />
        </MotionHStack>
      </HStack>

      <ResetPasswordModal
        openState={passwordResetModalOpen}
        handleOnClose={handleOnClose}
      />
    </>
  );
};

export default NavBar;
