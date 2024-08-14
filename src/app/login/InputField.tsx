"use client";

import {
  InputGroup,
  InputLeftElement,
  Input,
  Text,
  useTheme,
} from "@chakra-ui/react";
import { css } from "@emotion/react";
import { ReactElement, FocusEvent } from "react";

interface InputFieldProps {
  name: string;
  placeholder: string;
  type?: string;
  error?: { message: string } | undefined;
  icon: ReactElement;
  register: any;
  focusBorderColor: string;
}

export function InputField({
  name,
  placeholder,
  type = "text",
  error,
  icon,
  register,
  focusBorderColor,
}: InputFieldProps) {
  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    const icon = e.target.previousElementSibling?.querySelector(
      "svg"
    ) as HTMLElement | null;
    if (icon) {
      icon.style.color = focusBorderColor;
    }
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const icon = e.target.previousElementSibling?.querySelector(
      "svg"
    ) as HTMLElement | null;
    if (icon) {
      icon.style.color = "gray";
    }
  };

  const theme = useTheme();

  return (
    <>
      <InputGroup>
        {icon && (
          <InputLeftElement pointerEvents="none">{icon}</InputLeftElement>
        )}
        <Input
          {...register}
          name={name}
          type={type}
          placeholder={placeholder}
          _placeholder={{ color: "gray.400" }}
          borderColor={error ? "red.500" : "gray.400"}
          focusBorderColor={error ? "red.500" : focusBorderColor}
          borderLeft="none"
          borderTop="none"
          borderRight="none"
          borderRadius="sm"
          color={"black"}
          _focus={{
            boxShadow: `none`,
            borderBottomColor: error ? "red.500" : focusBorderColor,
            color: error ? "red.500" : focusBorderColor,
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          css={css`
            &:-webkit-autofill {
              -webkit-box-shadow: 0 0 0px 1000px ${theme.colors.pink[200]} inset; /* Override background color */
              box-shadow: 0 0 0px 1000px ${theme.colors.pink[200]} inset;
            }
            &:-webkit-autofill:focus {
              -webkit-box-shadow: 0 0 0px 1000px ${theme.colors.pink[300]} inset;
              box-shadow: 0 0 0px 1000px $ ${theme.colors.pink[300]} inset;
            }
          `}
        />

        {error && (
          <Text fontSize="sm" color="red.500">
            {error.message}
          </Text>
        )}
      </InputGroup>
    </>
  );
}
