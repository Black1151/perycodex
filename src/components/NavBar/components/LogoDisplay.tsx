// components/NavBar/LogoDisplay.tsx
import React from "react";
import { HStack, Image, Text, Badge, VStack } from "@chakra-ui/react";
import Link from "next/link";

interface LogoDisplayProps {
  userRole: string;
  toolLogo?: string;
  toolPath?: string;
  userIsFree?: boolean;
}

const LogoDisplay: React.FC<LogoDisplayProps> = ({
  userRole,
  toolLogo,
  toolPath,
  userIsFree,
}) => {
  const logoContent =
    toolLogo && toolLogo.trim() !== "" ? (
      <HStack spacing={2}>
        <Image src={toolLogo} alt="logo" height="50px" objectFit="contain" />
        {userIsFree && (
          <Badge
            colorScheme="green"
            h={"min-content"}
            fontSize={[10, 12]}
          >
            TRIAL
          </Badge>
        )}
      </HStack>
    ) : (
      <HStack spacing={2} alignItems="center" justifyContent="center">
        <Text
          fontFamily="bonfire"
          fontSize={[30, 40]}
          bgClip="text"
          color="white"
        >
          Perygon
        </Text>
        {userIsFree && (
          <Badge
            colorScheme="green"
            h={"min-content"}
            fontSize={[10, 12]}
            mb={2}
          >
            TRIAL
          </Badge>
        )}
      </HStack>
    );

  return userRole === "EU" ? (
    <>{logoContent}</>
  ) : (
    <Link href={toolPath || "/"}>{logoContent}</Link>
  );
};

export default LogoDisplay;
