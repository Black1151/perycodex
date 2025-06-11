"use client";

import React, { useState } from "react";
import {
  VStack,
  Box,
  Text,
  Button,
  useToast,
  useTheme,
  CheckboxGroup,
  Checkbox,
  Stack,
  HStack,
} from "@chakra-ui/react";
import { Header } from "../Header";
import PaletteIcon from '@mui/icons-material/Palette';
import CodeIcon from '@mui/icons-material/Code';
import SecurityIcon from '@mui/icons-material/Security';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { useSession } from "next-auth/react";

interface Service {
  id: string;
  name: string;
  price: string;
  description?: string;
  icon: React.ReactNode;
}

const AdditionalServicesPage: React.FC = () => {
  const toast = useToast();
  const theme = useTheme();
  const { data: session } = useSession();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleServiceChange = (value: string[]) => {
    setSelectedServices(value);
  };

  const handleSubmit = async () => {
    if (selectedServices.length === 0) {
      toast({
        title: "No services selected.",
        description: "Please select at least one service.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const servicesList = selectedServices.map((serviceId) => {
        const service = {
          'custom-theme': 'Custom Theme Creation (£299 one off)',
          'bespoke-development': 'Bespoke Tool, Dashboard or Report Development (£800 per day)',
          'enabling-sso': 'Enabling SSO (£200 one off)',
          'auto-user-signup': 'Enabling Auto Company User Signup (Free)',
        }[serviceId];
        return service;
      });

      const emailHtml = `
        <h2>New Additional Services Request</h2>
        <p><strong>User:</strong> ${session?.user?.name || 'Not provided'}</p>
        <p><strong>Email:</strong> ${session?.user?.email || 'Not provided'}</p>
        <h3>Selected Services:</h3>
        <ul>
          ${servicesList.map(service => `<li>${service}</li>`).join('')}
        </ul>
        <p>Please follow up with the customer regarding their interest in these services.</p>
      `;

      const response = await fetch('/api/...', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'additional-services-request',
          recipient: 'sales',
          subject: 'New Additional Services Request',
          html: emailHtml,
          metadata: {
            selectedServices,
            userEmail: session?.user?.email,
            userName: session?.user?.name,
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send notification');
      }

      toast({
        title: "Callback Request Sent!",
        description: "We will contact you shortly regarding your selected services.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setSelectedServices([]); // Clear selection after submission
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send your request. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const services: Service[] = [
    {
      id: "custom-theme",
      name: "Custom Theme Creation",
      price: "£200 one off payment",
      description: "Get a custom platform theme including brand colours and logo to match your company's identity.",
      icon: <PaletteIcon sx={{ color: theme.colors.primary }} />
    },
    {
      id: "enabling-sso",
      name: "Enabling SSO",
      price: "£200 one off payment",
      description: "Set up Single Sign-On integration with your existing identity provider (e.g., Azure AD, Google Workspace, Apple) for seamless user authentication.",
      icon: <SecurityIcon sx={{ color: theme.colors.primary }} />
    },
    {
      id: "auto-user-signup",
      name: "Enabling Auto Company User Signup",
      price: "Free!",
      description: "Automatically create and assign user accounts for your company, streamlining the onboarding process for new team members based on your company email address domain.",
      icon: <GroupAddIcon sx={{ color: theme.colors.primary }} />
    },
    {
      id: "bespoke-development",
      name: "Bespoke Tool, Dashboard or Report Development",
      price: "£850 per day",
      description: "Work with our development team to build bespoke tools, dashboards, or reports tailored to your specific business needs and requirements.",
      icon: <CodeIcon sx={{ color: theme.colors.primary }} />
    }
  ];

  return (
    <VStack spacing={2} align="center" w="100%">
      <Header title="Additional Services" />

      <Box
        bg={theme.colors.elementBG}
        borderRadius="lg"
        boxShadow="sm"
        p={[3, 4, 6]}
        color={theme.colors.primaryTextColor}
        w="100%"
      >
        <Text mb={[3, 4, 6]} fontSize="base" textAlign="left">
          Explore our additional services to enhance your Perygon capabilities. Select the services you are interested in for a callback.
        </Text>

        <CheckboxGroup value={selectedServices} onChange={handleServiceChange}>
          <VStack align="stretch" spacing={4} w="100%">
            {services.map((service) => (
              <Box
                key={service.id}
                w="100%"
                p={4}
                borderWidth="1px"
                borderRadius="md"
                borderColor={theme.colors.borderColor}
                _hover={{ borderColor: theme.colors.primary }}
                cursor="pointer"
                onClick={() => {
                  const newSelection = selectedServices.includes(service.id)
                    ? selectedServices.filter(id => id !== service.id)
                    : [...selectedServices, service.id];
                  handleServiceChange(newSelection);
                }}
              >
                {/* THIS wrapper stops clicks on the checkbox & icon from bubbling up */}
                <Stack
                  justify="space-between"
                  align={["left","center"]}
                  w="100%"
                  onClick={e => e.stopPropagation()}
                  flexDirection={["column", "row", "row"]}
                >
                  <HStack spacing={3} flex="1">
                    <Checkbox
                      value={service.id}
                      isChecked={selectedServices.includes(service.id)}
                    >
                      <Text fontWeight="bold" fontSize="md">
                        {service.name}
                      </Text>
                    </Checkbox>
                    {service.icon}
                  </HStack>
                  <Text fontSize="md" color="gray.500" ml={4}>
                    {service.price}
                  </Text>
                </Stack>
                {service.description && (
                  <Text fontSize="sm" mt={2} color="gray.400">
                    {service.description}
                  </Text>
                )}
              </Box>
            ))}

          </VStack>
        </CheckboxGroup>

        <Button
          mt={8}
          colorScheme="teal"
          onClick={handleSubmit}
          w="100%"
          isDisabled={selectedServices.length === 0 || isSubmitting}
          isLoading={isSubmitting}
        >
          Request Callback
        </Button>
      </Box>
    </VStack>
  );
};

export default function Page() {
  return <AdditionalServicesPage />;
}
