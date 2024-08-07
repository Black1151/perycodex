import React, { useEffect, useState } from "react";
import { Box, BoxProps, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

interface CounterProps extends BoxProps {
  value: number;
}

const Counter: React.FC<CounterProps> = ({ value, ...rest }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted && value > 0) {
      let start = 0;
      const increment = value / 100;
      const interval = setInterval(() => {
        start += increment;
        if (start >= value) {
          clearInterval(interval);
          setDisplayValue(value);
        } else {
          setDisplayValue(Math.floor(start));
        }
      }, 10);

      return () => clearInterval(interval);
    }
  }, [value, hasMounted]);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      fontSize="md"
      lineHeight={0}
      {...rest}
    >
      <Text as={motion.div} fontWeight="bold">
        {hasMounted ? displayValue : 0}
      </Text>
    </Box>
  );
};

export default Counter;
