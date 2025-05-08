import React, { useState } from "react";
import {
  Box,
  HStack,
  Text,
  Badge,
  Button,
  useTheme,
  VStack,
  RadioGroup,
  Radio,
} from "@chakra-ui/react";
import { ToolResource } from "./types";

interface ToolPurchasePanelProps {
  /** The single tool state from useBasket */
  item: ToolResource;
  /** Whether to show a trial button */
  isTrialable?: boolean;
  /** Hook actions */
  addTool: (tool: ToolResource) => void;
  removeTool: (id: ToolResource) => void;
}

export function ToolPurchasePanel({
  item,
  isTrialable = false,
  addTool,
  removeTool,
}: ToolPurchasePanelProps) {
  const theme = useTheme();

  // Local state for new tool billing cycle selection
  // const [selectedCycle, setSelectedCycle] = useState<"monthly" | "annual">(
  //   billingCycle || "monthly"
  // );

  // Format currency
  // const fmt = (amt: number) =>
  //   new Intl.NumberFormat("en-GB", {
  //     style: "currency",
  //     currency: "GBP",
  //     minimumFractionDigits: 2,
  //   }).format(amt);

  // // Discount vs. 12× monthly
  // const discountPct = Math.round(
  //   ((monthlyPrice * 12 - annualPrice) / (monthlyPrice * 12)) * 100
  // );

  return (
    <VStack spacing={4} align="stretch" w="100%">

      {/* Continue adds the tool with selected billing cycle */}
      <Button
        mt={2}
        colorScheme="blue"
        width="full"
        onClick={() => addTool(item)}
      >
        Add To Subscription
      </Button>
      <Button
        mt={2}
        colorScheme="blue"
        width="full"
        onClick={() => removeTool(item)}
      >
        Remove From Subscription
      </Button>
    </VStack>
  );
}
