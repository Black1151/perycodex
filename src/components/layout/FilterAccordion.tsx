import React, { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Checkbox,
  VStack,
} from "@chakra-ui/react";
import { FilterOptionGroup } from "@/app/(site)/(apps)/happiness-score/dashboard/manager-dashboard/ManagerDashboard";

interface FilterAccordionProps {
  filterOptions: FilterOptionGroup[];
  handleCheckboxChange: (
    groupIndex: number,
    optionIndex: number,
    isChecked: boolean,
  ) => void;
}

const FilterAccordion: React.FC<FilterAccordionProps> = ({
  filterOptions,
  handleCheckboxChange,
}) => {
  return (
    <Accordion allowMultiple>
      {filterOptions.map((group, groupIndex) => (
        <AccordionItem key={group.label}>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              {group.label}
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            {group.options.map((option, optionIndex) => (
              <VStack key={option.value} align="start">
                <Checkbox
                  isChecked={option.isSelected}
                  isDisabled={option.isDisabled}
                  onChange={(e) =>
                    handleCheckboxChange(
                      groupIndex,
                      optionIndex,
                      e.target.checked,
                    )
                  }
                  colorScheme={option.isDisabled ? "gray" : "blue"}
                  style={{
                    textDecoration: option.isDisabled ? "line-through" : "none",
                    color: option.isDisabled ? "gray" : "inherit",
                  }}
                >
                  {option.label}
                </Checkbox>
              </VStack>
            ))}
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default FilterAccordion;
