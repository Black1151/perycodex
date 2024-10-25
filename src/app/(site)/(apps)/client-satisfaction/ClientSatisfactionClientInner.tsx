"use client";

import { useEffect, useState } from "react";
import { Tool } from "@/types/types";
import { LeftHandNavigationDrawer } from "@/components/layout/LeftHandNavigationDrawer";
import { RightHandNavigationDrawer } from "@/components/layout/RightHandNavigationDrawer";

interface ClientSatisfactionClientInnerProps {
  toolData: Tool;
}

export default function ClientSatisfactionClientInner({}: ClientSatisfactionClientInnerProps) {
  const [isLoading, setIsLoading] = useState(false); // set to true when implementing splash screen

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 6000);
  }, []);

  return (
    <>
      <LeftHandNavigationDrawer title={"User Menu"} />
      <RightHandNavigationDrawer />
    </>
  );
}
