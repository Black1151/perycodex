import React, { useState, useEffect } from "react";
import { Select } from "@chakra-ui/react";
import { format } from "date-fns";
import {
  DateRangeMode,
  dateRangeOptions,
  ModeValueMap,
} from "@/components/Sidebars/Dashboards Filter/dateRangeUtils";

interface DateFilterProps<T extends DateRangeMode> {
  filterMode: T;
  defaultDateFilter?: ModeValueMap[T];
  onDateChange: (startDate: string, endDate: string, value: string) => void;
  clearSignal?: number;
}

const DateFilter = <T extends DateRangeMode>({
  onDateChange,
  filterMode,
  defaultDateFilter,
  clearSignal,
}: DateFilterProps<T>) => {
  const [dateFilterMode, setDateFilterMode] =
    useState<DateRangeMode>(filterMode);

  const handleDateChange = (value: string) => {
    const selectedRange = dateRangeOptions[filterMode].find(
      (range) => range.value === value,
    );

    if (selectedRange) {
      const [startDate, endDate] = selectedRange.getRange();
      onDateChange(
        format(startDate, "yyyy-MM-dd"),
        format(endDate, "yyyy-MM-dd"),
        value,
      );
    } else {
      if (defaultDateFilter) {
        onDateChange("", "", defaultDateFilter);
      } else {
        onDateChange("", "", "");
      }
    }
  };

  useEffect(() => {
    if (defaultDateFilter) {
      handleDateChange(defaultDateFilter);
    }
  }, []);

  useEffect(() => {
    if (clearSignal && defaultDateFilter) {
      handleDateChange(defaultDateFilter);
    } else if (clearSignal) {
      // If there's no default, we clear entirely
      handleDateChange("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearSignal]);

  return (
    <Select
      placeholder="All"
      value={defaultDateFilter}
      onChange={(e) => handleDateChange(e.target.value)}
    >
      {dateRangeOptions[dateFilterMode].map((range) => (
        <option key={range.value} value={range.value}>
          {range.name}
        </option>
      ))}
    </Select>
  );
};

export default DateFilter;
