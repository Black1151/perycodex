// components/NavBar/LogoDisplay.tsx
import React from "react";
import { HStack, Image, Text, Badge } from "@chakra-ui/react";
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
      // <HStack
      //   spacing={0}
      //   alignItems="center"
      //   justifyContent="center"
      //   ml={3}
      //   //position="relative"
      // >
      //   <Image src={toolLogo} alt="logo" height="50px" objectFit="contain" />
      //   <Badge
      //     colorScheme="green"
      //     h={"min-content"}
      //     // position={"absolute"}
      //     // bottom={[0., 0]}
      //     // left={[0, 0]}
      //     fontSize={[10, 12]}
      //     transform={["rotate(45deg)", "rotate(-25deg)"]}
      //   >
      //     TRIAL
      //   </Badge>
      // </HStack>

              <Image src={toolLogo} alt="logo" height="50px" objectFit="contain" />

    ) : (
      <HStack
        spacing={0}
        alignItems="center"
        justifyContent="center"
        //position="relative"
      >
        <Text
          fontFamily="bonfire"
          fontSize={[30, 40]}
          bgClip="text"
          color="white"
        >
          Perygon
        </Text>
        <Badge
          colorScheme="green"
          h={"min-content"}
          // position={"absolute"}
          // bottom={[0, 4]}
          // right={[0, -5]}
          fontSize={[10, 12]}
          transform={["rotate(45deg)", "rotate(-25deg)"]}
        >
          TRIAL
        </Badge>
      </HStack>
    );

  return userRole === "EU" ? (
    <>{logoContent}</>
  ) : (
    <Link href={toolPath || "/"}>{logoContent}</Link>
  );
};

export default LogoDisplay;
