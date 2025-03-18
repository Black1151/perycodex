// components/NavBar/LogoDisplay.tsx
import React from "react";
import { Image, Text } from "@chakra-ui/react";
import Link from "next/link";

interface LogoDisplayProps {
  userRole: string;
  toolLogo?: string;
  toolPath?: string;
}

const LogoDisplay: React.FC<LogoDisplayProps> = ({
  userRole,
  toolLogo,
  toolPath,
}) => {
  const logoContent =
    toolLogo && toolLogo.trim() !== "" ? (
      <Image src={toolLogo} alt="logo" height="50px" objectFit="contain" />
    ) : (
      <Text
        fontFamily="bonfire"
        fontSize={[30, 40]}
        bgClip="text"
        color="white"
      >
        Perygon
      </Text>
    );

  return userRole === "EU" ? (
    <>{logoContent}</>
  ) : (
    <Link href={toolPath || "/"}>{logoContent}</Link>
  );
};

export default LogoDisplay;
