"use client";

import { FC } from "react";
import Confetti from "@/components/animations/confetti/Confetti";

interface ConfettiWrapperProps {
  show: boolean;
  duration?: number;
}

export const ConfettiWrapper: FC<ConfettiWrapperProps> = ({
  show,
  duration,
}) => {
  if (!show) return null;
  return <Confetti show={show} duration={duration} />;
};
