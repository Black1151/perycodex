"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { HappinessScoreSplashScreen } from "./HappinessScoreSplashScreen";

interface HappinessScoreLandingPageInnerProps {
  redirectUrl?: string | null;
}

export const HappinessScoreLandingPageInner = ({
  redirectUrl,
}: HappinessScoreLandingPageInnerProps) => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (redirectUrl) {
        router.push(redirectUrl);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [redirectUrl, router]);

  return <HappinessScoreSplashScreen />;
};
