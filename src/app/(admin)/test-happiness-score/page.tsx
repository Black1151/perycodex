import AdminHeader from "@/components/AdminHeader";
import {getUserIdentity} from "@/lib/getUserIdentity";
import {checkUserRole} from "@/lib/checkUserRole";
import CreateComponent from "@/app/(admin)/test-happiness-score/CreateComponent";
import {Box, Flex, Grid, Text} from "@chakra-ui/react";
import {LeftHandNavigationDrawer} from "@/components/layout/LeftHandNavigationDrawer";
import DashboardLayout from "@/app/(admin)/test-happiness-score/DashboardLayout";

interface SearchParams {
    toolId?: string;
    workflowId?: string;
}

export default async function TestHappinessScorePage({searchParams}: { searchParams: SearchParams }) {
    const userIdentity = await getUserIdentity();
    checkUserRole(userIdentity, `/test-happiness-score`);

    const tId = searchParams.toolId;
    const wfId = searchParams.workflowId;
    return (
        <>
            <AdminHeader headingText={'Test Happiness Score Dashboard (API)'}/>
            <DashboardLayout/>

            {/* Pretend CreateComponent */}
            <Flex width={'full'} align={'center'} justify={'flex-end'}>

                <Box mt={6}>
                    <CreateComponent wfId={wfId} tId={tId}/>
                </Box>
            </Flex>

            <Box py={3} borderRadius="lg">
                <Text fontSize="xl" color="seduloRed" fontWeight="bold"></Text>

                {/* Pretend Dashboard Grid */}
                <Grid templateColumns="repeat(3, 1fr)" gap={6} mt={6}>
                    {/* Pretend KPI Box 1 */}
                    <Box bg="yellow" borderRadius="lg" p={5} color="black" shadow={'lg'}>
                        <Text fontSize="lg" fontWeight="bold">KPI 1</Text>
                        <Text fontSize="sm">Details about KPI 1</Text>
                    </Box>

                    {/* Pretend KPI Box 2 */}
                    <Box bg="seduloGreen" borderRadius="lg" p={5} color="white" shadow={'lg'}>
                        <Text fontSize="lg" fontWeight="bold">KPI 2</Text>
                        <Text fontSize="sm">Details about KPI 2</Text>
                    </Box>

                    {/* Pretend KPI Box 3 */}
                    <Box bg="perygonPink" borderRadius="lg" p={5} color="white" shadow={'lg'}>
                        <Text fontSize="lg" fontWeight="bold">KPI 3</Text>
                        <Text fontSize="sm">Details about KPI 3</Text>
                    </Box>
                </Grid>

                {/* Pretend Chart or Graph Box */}
                <Box bg={'perygonBackground'} borderRadius="lg" p={5} mt={6} color="white" border={'white 1px solid'}
                     height={'500px'} shadow={'lg'}>
                    <Text fontSize="lg" fontWeight="bold">Chart Placeholder</Text>
                    <Text fontSize="sm">This could be a line chart or a bar graph about user happiness.</Text>
                </Box>

                {/* Pretend Table Box */}
                <Box bg="gray.100" borderRadius="lg" p={5} mt={6} color="black" border={'white 1px solid'}
                     height={'500px'} shadow={'lg'}>
                    <Text fontSize="lg" fontWeight="bold">Table Placeholder</Text>
                    <Text fontSize="sm">This could be a table showing the details of the happiness score by user.</Text>
                </Box>


            </Box>
        </>
    );
}
