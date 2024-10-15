"use client";
import {
    VStack,
    Text,
    Divider,
    useTheme
} from "@chakra-ui/react";
import {useRouter} from "next/navigation";
import {
    Business,
    People,
    GroupWork,
    Tag,
    PeopleAlt,
    Domain,
    EmojiPeople
} from '@mui/icons-material';
import {useUser} from "@/context/AdminUserContext"; // Import MUI icons


interface SidebarProps {
    userRole?: string;  // Optional userRole prop
}

export default function Sidebar() {
    const theme = useTheme();
    const router = useRouter();
    const {userRole} = useUser();

    return (
        <VStack
            align="start"
            spacing={4}
            width="250px"
            bg={theme.colors.gray[800]}
            color="white"
            p={4}
            flexShrink={1}
        >
            <Text>User Role: {userRole}</Text>
            {!userRole && (
                <Text>No role</Text>
            )}
            {/* Conditional rendering based on userRole */}
            {userRole === 'CA' && (
                <>
                    <Text
                        cursor="pointer"
                        _hover={{color: theme.colors.perygonPink}}
                        onClick={() => router.push('/my-company')}
                    >
                        <Business fontSize="small" style={{marginRight: '8px'}}/>
                        My Company
                    </Text>
                    <Text
                        cursor="pointer"
                        _hover={{color: theme.colors.perygonPink}}
                        onClick={() => router.push('/my-company-users')}
                    >
                        <People fontSize="small" style={{marginRight: '8px'}}/>
                        My Company Users
                    </Text>
                    <Text
                        cursor="pointer"
                        _hover={{color: theme.colors.perygonPink}}
                        onClick={() => router.push('/my-company-sites')}
                    >
                        <Domain fontSize="small" style={{marginRight: '8px'}}/>
                        My Company Sites
                    </Text>
                    <Text
                        cursor="pointer"
                        _hover={{color: theme.colors.perygonPink}}
                        onClick={() => router.push('/teams')}
                    >
                        <GroupWork fontSize="small" style={{marginRight: '8px'}}/>
                        Teams
                    </Text>
                    <Text
                        cursor="pointer"
                        _hover={{color: theme.colors.perygonPink}}
                        onClick={() => router.push('/user-groups')}
                    >
                        <PeopleAlt fontSize="small" style={{marginRight: '8px'}}/>
                        User Groups
                    </Text>
                    <Text
                        cursor="pointer"
                        _hover={{color: theme.colors.perygonPink}}
                        onClick={() => console.log("Tags Clicked")}
                    >
                        <Tag fontSize="small" style={{marginRight: '8px'}}/>
                        Tags
                    </Text>

                    {/* Divider between sections */}
                    <Divider borderColor={theme.colors.gray[600]}/>

                    <Text
                        cursor="pointer"
                        _hover={{color: theme.colors.perygonPink}}
                        onClick={() => router.push('/our-clients')}
                    >
                        <EmojiPeople fontSize="small" style={{marginRight: '8px'}}/>
                        Our Clients
                    </Text>
                    <Text
                        cursor="pointer"
                        _hover={{color: theme.colors.perygonPink}}
                        onClick={() => router.push('/our-client-users')}
                    >
                        <People fontSize="small" style={{marginRight: '8px'}}/>
                        Our Client Users
                    </Text>
                    <Text
                        cursor="pointer"
                        _hover={{color: theme.colors.perygonPink}}
                        onClick={() => router.push('/our-client-sites')}
                    >
                        <Domain fontSize="small" style={{marginRight: '8px'}}/>
                        Our Client Sites
                    </Text>
                </>
            )}

            {userRole === 'PA' && (
                <>
                    <Text
                        cursor="pointer"
                        _hover={{color: theme.colors.perygonPink}}
                        onClick={() => router.push('/customers')}
                    >
                        <EmojiPeople fontSize="small" style={{marginRight: '8px'}}/>
                        Customers
                    </Text>
                    <Text
                        cursor="pointer"
                        _hover={{color: theme.colors.perygonPink}}
                        onClick={() => router.push('/users')}
                    >
                        <People fontSize="small" style={{marginRight: '8px'}}/>
                        Users
                    </Text>
                    <Text
                        cursor="pointer"
                        _hover={{color: theme.colors.perygonPink}}
                        onClick={() => router.push('/sites')}
                    >
                        <Domain fontSize="small" style={{marginRight: '8px'}}/>
                        Sites
                    </Text>
                    <Text
                        cursor="pointer"
                        _hover={{color: theme.colors.perygonPink}}
                        onClick={() => router.push('/user-groups')}
                    >
                        <PeopleAlt fontSize="small" style={{marginRight: '8px'}}/>
                        User Groups
                    </Text>
                    <Text
                        cursor="pointer"
                        _hover={{color: theme.colors.perygonPink}}
                        onClick={() => window.alert('Tags Clicked')}
                    >
                        <Tag fontSize="small" style={{marginRight: '8px'}}/>
                        Tags
                    </Text>

                    {/* Divider for another section if needed */}
                    <Divider borderColor={theme.colors.gray[600]}/>

                    <Text
                        cursor="pointer"
                        _hover={{color: theme.colors.perygonPink}}
                        onClick={() => window.alert('Other Admin')}
                    >
                        <GroupWork fontSize="small" style={{marginRight: '8px'}}/>
                        Other Workflow Admin
                    </Text>
                </>
            )}
        </VStack>
    );
}

