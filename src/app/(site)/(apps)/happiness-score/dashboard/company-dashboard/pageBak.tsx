// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   Grid,
//   GridItem,
//   Select,
//   Flex,
//   HStack,
//   VStack,
//   Box,
// } from "@chakra-ui/react";
// import BarGraph from "@/components/graphs/BarGraph";
// import LineGraph from "@/components/graphs/LineGraph";
// import { HappinessScoreMasonry } from "../../HappinessScoreMasonry";
// import { SectionHeader } from "@/components/sectionHeader/SectionHeader";
// import { SpringScale } from "@/components/animations/SpringScale";
// import SpeechBubble from "../../SpeechBubble";
// import { DashboardFilteringDrawer } from "@/components/layout/DashboardFilteringDrawer";

// interface DataPoint {
//   value: number;
//   title: string;
// }

// export interface FilterOption {
//   label: string;
//   value: string;
//   isSelected?: boolean;
//   isDisabled?: boolean;
// }

// export interface FilterOptionGroup {
//   label: string;
//   options: FilterOption[];
// }

// export default function ManagerDashboardPage() {
//   const [selectedOption, setSelectedOption] = useState("siteName");
//   const [barGraphData, setBarGraphData] = useState<DataPoint[]>([]);
//   const [masonryData, setMasonryData] = useState<number[]>([]);
//   const [clickedGroupValue, setClickedGroupValue] = useState<string>("All");
//   const [personDetails, setPersonDetails] = useState<any[]>([]);
//   const [groupOptions, setGroupOptions] = useState<string[]>([]);
//   const [lineGraphData, setLineGraphData] = useState<DataPoint[]>([]);
//   const [currentScore, setCurrentScore] = useState<number | null>(null);
//   const [scoreChange, setScoreChange] = useState<number>(0);
//   const [positiveChange, setPositiveChange] = useState<boolean>(true);
//   const [scoreText, setScoreText] = useState<string>("");
//   const [filterOptions, setFilterOptions] = useState<FilterOptionGroup[]>([]);

//   useEffect(() => {
//     fetchBarGraphData(selectedOption);
//     fetchGroupOptions(selectedOption);
//     fetchLineGraphData(selectedOption, clickedGroupValue);
//     setClickedGroupValue("All");
//   }, [selectedOption]);

//   useEffect(() => {
//     fetchMasonryData(selectedOption, clickedGroupValue);
//     fetchLineGraphData(selectedOption, clickedGroupValue);
//     setPersonDetails([]);
//   }, [clickedGroupValue]);

//   const handleCheckboxChange = (
//     groupIndex: number,
//     optionIndex: number,
//     isChecked: boolean
//   ) => {
//     setFilterOptions((prev) => {
//       const newOptions = [...prev];
//       newOptions[groupIndex].options[optionIndex].isSelected = isChecked;
//       return newOptions;
//     });
//   };

//   const fetchBarGraphData = async (option: string) => {
//     try {
//       const response = await fetch(
//         `/api/happiness-graphs/getManagerDashboardData?groupBy=${encodeURIComponent(
//           option
//         )}&action=bargraph`
//       );

//       if (!response.ok) {
//         throw new Error(`Error fetching data: ${response.statusText}`);
//       }

//       const data = await response.json();

//       console.log("fetchBarGraphData", data);

//       setBarGraphData(data.data);
//     } catch (error) {
//       console.error("Failed to fetch bar graph data:", error);
//     }
//   };

//   const fetchGroupOptions = async (option: string) => {
//     try {
//       const response = await fetch(
//         `/api/happiness-graphs/getManagerDashboardData?groupBy=${encodeURIComponent(
//           option
//         )}&action=bargraph`
//       );

//       if (!response.ok) {
//         throw new Error(`Error fetching data: ${response.statusText}`);
//       }

//       const data = await response.json();

//       // Extract group options from bar graph data
//       const options = data.data.map((item: { title: string }) => item.title);
//       setGroupOptions(["All", ...options]);
//     } catch (error) {
//       console.error("Failed to fetch group options:", error);
//     }
//   };

//   const fetchMasonryData = async (
//     groupBy: string,
//     groupValue: string = "All"
//   ) => {
//     try {
//       const queryParams =
//         groupValue && groupValue !== "All"
//           ? `?groupBy=${encodeURIComponent(
//               groupBy
//             )}&groupValue=${encodeURIComponent(groupValue)}&action=masonry`
//           : `?groupBy=${encodeURIComponent(groupBy)}&action=masonry`;

//       const response = await fetch(
//         `/api/happiness-graphs/getManagerDashboardData${queryParams}`
//       );

//       if (!response.ok) {
//         throw new Error(`Error fetching data: ${response.statusText}`);
//       }

//       const data = await response.json();
//       console.log("Masonry Data:", data);
//       setMasonryData(data.data);
//     } catch (error) {
//       console.error("Failed to fetch masonry data:", error);
//     }
//   };

//   const fetchPersonDetails = async (
//     groupBy: string,
//     groupValue: string = "All",
//     category: string
//   ) => {
//     try {
//       const queryParams =
//         groupValue && groupValue !== "All"
//           ? `?groupBy=${encodeURIComponent(
//               groupBy
//             )}&groupValue=${encodeURIComponent(
//               groupValue
//             )}&category=${encodeURIComponent(category)}&action=masonry`
//           : `?groupBy=${encodeURIComponent(
//               groupBy
//             )}&category=${encodeURIComponent(category)}&action=masonry`;

//       const response = await fetch(
//         `/api/happiness-graphs/getManagerDashboardData${queryParams}`
//       );

//       if (!response.ok) {
//         throw new Error(`Error fetching data: ${response.statusText}`);
//       }

//       const data = await response.json();
//       console.log("Person Details:", data);
//       setPersonDetails(data.data);
//     } catch (error) {
//       console.error("Failed to fetch person details:", error);
//     }
//   };

//   const fetchLineGraphData = async (
//     groupBy: string,
//     groupValue: string = "All"
//   ) => {
//     try {
//       let queryParams = `?action=linegraph`;

//       if (groupBy && groupBy !== "All") {
//         queryParams += `&groupBy=${encodeURIComponent(groupBy)}`;
//         if (groupValue && groupValue !== "All") {
//           queryParams += `&groupValue=${encodeURIComponent(groupValue)}`;
//         }
//       }

//       const response = await fetch(
//         `/api/happiness-graphs/getManagerDashboardData${queryParams}`
//       );

//       if (!response.ok) {
//         throw new Error(`Error fetching data: ${response.statusText}`);
//       }

//       const data = await response.json();
//       console.log("Line Graph Data:", data);
//       setLineGraphData(data.data);

//       if (data.data && data.data.length > 0) {
//         const dataPoints = data.data;
//         const lastPoint = dataPoints[dataPoints.length - 1];
//         const secondLastPoint =
//           dataPoints.length >= 2 ? dataPoints[dataPoints.length - 2] : null;

//         setCurrentScore(lastPoint.value);

//         if (secondLastPoint) {
//           const change = lastPoint.value - secondLastPoint.value;
//           setScoreChange(Math.abs(change));
//           setPositiveChange(change >= 0);
//         } else {
//           setScoreChange(0);
//           setPositiveChange(true);
//         }

//         let scoreText = "";
//         if (lastPoint.value >= 9) {
//           scoreText = "World Class";
//         } else if (lastPoint.value >= 7) {
//           scoreText = "Great!";
//         } else if (lastPoint.value >= 5) {
//           scoreText = "Good";
//         } else if (lastPoint.value >= 3) {
//           scoreText = "Average";
//         } else {
//           scoreText = "Needs Improvement";
//         }
//         setScoreText(scoreText);
//       } else {
//         setCurrentScore(null);
//         setScoreChange(0);
//         setPositiveChange(true);
//         setScoreText("");
//       }
//     } catch (error) {
//       console.error("Failed to fetch line graph data:", error);
//     }
//   };

//   const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedOption(event.target.value);
//     setClickedGroupValue("All");
//   };

//   const handleGroupValueChange = (
//     event: React.ChangeEvent<HTMLSelectElement>
//   ) => {
//     const value = event.target.value;
//     setClickedGroupValue(value);
//   };

//   const handleBarClick = (groupValue: string) => {
//     setClickedGroupValue(groupValue);
//   };

//   const handleMasonryClick = (category: string) => {
//     fetchPersonDetails(selectedOption, clickedGroupValue, category);
//   };

//   return (
//     <>
//       <DashboardFilteringDrawer
//         handleCheckboxChange={handleCheckboxChange}
//         filterOptions={filterOptions}
//         title="Data Filters"
//       />
//       {masonryData && barGraphData && (
//         <Flex flexDirection="column" width="100%" p={4} my={20}>
//           <Grid templateColumns={["1fr", null, "1fr 1fr"]} gap={[20, null, 6]}>
//             {/* Speech Bubble Section */}
//             <GridItem>
//               <VStack>
//                 <SectionHeader>Current Happiness Score</SectionHeader>
//                 {currentScore !== null && (
//                   <SpringScale delay={0.2}>
//                     <Flex minHeight={[0, null, 500]} minWidth={500}>
//                       <SpeechBubble
//                         score={currentScore}
//                         positiveChange={positiveChange}
//                         change={scoreChange}
//                         fill="#fff"
//                       />
//                     </Flex>
//                   </SpringScale>
//                 )}
//               </VStack>
//             </GridItem>

//             {/* Happiness Overview */}
//             <GridItem>
//               <VStack height="100%">
//                 <HStack
//                   width="100%"
//                   justifyContent="space-between"
//                   alignItems="flex-start"
//                 >
//                   <SectionHeader>Happiness Overview</SectionHeader>
//                   <Select
//                     value={selectedOption}
//                     onChange={handleOptionChange}
//                     mb={4}
//                     bg="white"
//                     maxWidth={150}
//                   >
//                     <option value="siteName">Site</option>
//                     <option value="departmentName">Department</option>
//                     <option value="jobLevel">Job Level</option>
//                   </Select>
//                 </HStack>
//                 <BarGraph
//                   DataPoints={barGraphData}
//                   onBarClick={handleBarClick}
//                 />
//               </VStack>
//             </GridItem>
//             {/* Happiness by Individuals */}
//             <GridItem>
//               <VStack align="stretch">
//                 <HStack
//                   width="100%"
//                   justifyContent="space-between"
//                   alignItems="flex-start"
//                 >
//                   <SpringScale delay={0.2}>
//                     <Box mb={2}>
//                       <SectionHeader>Happiness by Individuals</SectionHeader>
//                     </Box>
//                   </SpringScale>
//                   <Select
//                     value={clickedGroupValue}
//                     onChange={handleGroupValueChange}
//                     bg="white"
//                     maxWidth={150}
//                   >
//                     {groupOptions.map((option) => (
//                       <option key={option} value={option}>
//                         {option}
//                       </option>
//                     ))}
//                   </Select>
//                 </HStack>
//                 <HappinessScoreMasonry
//                   masonryValues={masonryData}
//                   onStatClick={handleMasonryClick}
//                 />
//               </VStack>
//             </GridItem>
//             <GridItem>
//               {lineGraphData.length > 0 && (
//                 <VStack mt={8} align="stretch">
//                   <SectionHeader>Happiness Over Time</SectionHeader>
//                   <LineGraph DataPoints={lineGraphData} />
//                 </VStack>
//               )}
//             </GridItem>
//           </Grid>
//           {personDetails.length > 0 && (
//             <VStack mt={8} align="stretch">
//               <SectionHeader>Person Details</SectionHeader>
//               {personDetails.map((person, index) => (
//                 <Flex
//                   key={index}
//                   p={4}
//                   bg="gray.100"
//                   borderRadius="md"
//                   alignItems="center"
//                   justifyContent="space-between"
//                 >
//                   <Flex flexDirection="column">
//                     <strong>
//                       {person.firstName} {person.lastName}
//                     </strong>
//                     <span>{person.departmentName}</span>
//                     <span>{person.siteName}</span>
//                   </Flex>
//                   <Flex flexDirection="column" alignItems="flex-end">
//                     <span>Score: {person.happinessScore}</span>
//                     <span>Comments: {person.comments || "N/A"}</span>
//                   </Flex>
//                 </Flex>
//               ))}
//             </VStack>
//           )}
//         </Flex>
//       )}
//     </>
//   );
// }
