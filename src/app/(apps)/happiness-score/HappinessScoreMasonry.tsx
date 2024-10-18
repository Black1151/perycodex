import { SpringScale } from "@/components/animations/SpringScale";
import { StatBox } from "@/components/Masonry/StatsMasonry/StatBox";
import { SectionHeader } from "@/components/sectionHeader/SectionHeader";
import {
  Box,
  GridItem,
  SimpleGrid,
  Stack,
  useTheme,
  VStack,
} from "@chakra-ui/react";

export const HappinessScoreMasonry = () => {
  const theme = useTheme();

  return (
    <VStack flex={1}>
      <SpringScale delay={0.2}>
        <Box mb={2}>
          <SectionHeader>Happiness by Individuals</SectionHeader>
        </Box>
      </SpringScale>
      <SimpleGrid gap={[2, 5]} columns={[2]} flex={1} w="100%">
        <SpringScale delay={0}>
          <StatBox
            bgColor={"red"}
            data="22"
            title={"1-2"}
            titleImage="/faces/happiness_score_2.png"
          />
        </SpringScale>
        <SpringScale delay={0.5}>
          <StatBox
            bgColor={theme.colors.yellow}
            data={"153"}
            title={"3-5"}
            titleImage="/faces/happiness_score_6.png"
          />
        </SpringScale>
        <SpringScale delay={0.7}>
          <StatBox
            bgColor={theme.colors.lightGreen}
            data={"6"}
            title={"6-8"}
            titleImage="/faces/happiness_score_8.png"
          />
        </SpringScale>
        <SpringScale delay={1.2}>
          <StatBox
            bgColor={theme.colors.seduloGreen}
            data={"220"}
            title={"9-10"}
            titleImage="/faces/happiness_score_9.png"
          />
        </SpringScale>
        <GridItem colSpan={2}>
          <SpringScale delay={0.3}>
            <StatBox
              bgColor="lightGray"
              data={"7"}
              title={"Did not participate"}
              counterColor={"lightGray"}
            />
          </SpringScale>
        </GridItem>
      </SimpleGrid>
    </VStack>
  );
};
