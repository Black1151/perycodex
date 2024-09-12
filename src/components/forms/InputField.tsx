"use client";

import {
  InputGroup,
  InputLeftElement,
  Input,
  Text,
  VStack,
  HStack,
  Select,
  useTheme,
} from "@chakra-ui/react";
import { css } from "@emotion/react";
import { ReactElement, FocusEvent, useState } from "react";
import { FieldError } from "react-hook-form";

interface InputFieldProps {
  name: string;
  placeholder: string;
  type?: string;
  error?: FieldError | undefined;
  icon?: ReactElement;
  register: any;
  focusBorderColor: string;
  options?: { value: string | number; label: string }[];
}

export type DropdownOption = {
  value: string | number;
  label: string;
};

export function InputField({
  name,
  placeholder,
  type = "text",
  error,
  icon,
  register,
  focusBorderColor = "#ff0070",
  options,
}: InputFieldProps) {
  const [selectedValue, setSelectedValue] = useState("");
  const theme = useTheme();

  const handleFocus = (e: FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const iconElement = e.target.previousElementSibling?.querySelector(
      "svg"
    ) as HTMLElement | null;
    if (iconElement) {
      iconElement.style.color = error ? "red" : focusBorderColor;
    }
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const iconElement = e.target.previousElementSibling?.querySelector(
      "svg"
    ) as HTMLElement | null;
    if (iconElement) {
      iconElement.style.color = error ? "red" : "lightGray";
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    onChange: Function
  ) => {
    setSelectedValue(e.target.value);
    onChange(e);
  };

  const commonStyles = {
    width: "100%",
    paddingTop: "0.5rem",
    paddingBottom: "0.5rem",
    borderColor: error ? "red" : "gray.400",
    borderBottomWidth: "1px",
    borderLeft: "none",
    borderTop: "none",
    borderRight: "none",
    borderRadius: "none",
    color: "black",
    fontSize: "sm",
    _placeholder: { fontSize: "sm", color: "gray.400" },
    _focus: {
      boxShadow: "none",
      borderBottomColor: error ? "red.500" : focusBorderColor,
      color: error ? "red.500" : focusBorderColor,
    },
    css: css`
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px ${theme.colors.pink[200]} inset;
        box-shadow: 0 0 0px 1000px ${theme.colors.pink[200]} inset;
      }
      &:-webkit-autofill:focus {
        -webkit-box-shadow: 0 0 0px 1000px ${theme.colors.pink[300]} inset;
        box-shadow: 0 0 0px 1000px ${theme.colors.pink[300]} inset;
      }
    `,
  };

  return (
    <VStack width="100%">
      <InputGroup alignItems="center" width="100%" px={0}>
        {icon && (
          <InputLeftElement pr={1} pointerEvents="none">
            {icon}
          </InputLeftElement>
        )}

        {options ? (
          <Select
            {...register(name)}
            onChange={(e) => handleChange(e, register(name).onChange)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            value={selectedValue}
            pl={0}
            sx={{
              color: selectedValue === "" ? "gray.400" : "black",
            }}
            {...commonStyles}
          >
            <option value="" disabled hidden>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option.value} value={Number(option.value)}>
                {option.label}
              </option>
            ))}
          </Select>
        ) : (
          <Input
            {...register(name)}
            type={type}
            placeholder={placeholder}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...commonStyles}
          />
        )}
      </InputGroup>

      <HStack w="100%" h={5}>
        {error && (
          <Text fontWeight="bold" fontSize="2xs" color="red">
            {error.message}
          </Text>
        )}
      </HStack>
    </VStack>
  );
}
