"use client";

import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
import {
  Box,
  HStack,
  Text,
  VStack,
  Stack,
  Button,
  useBreakpointValue,
  useToast,
  FormControl,
  FormLabel,
  Select,
  Spinner,
} from "@chakra-ui/react";
import { useFetchClient } from "@/hooks/useFetchClient";
import { useUser } from "@/providers/UserProvider";

interface Address {
  address1: string;
  address2: string;
  city: string;
  county: string;
  postcode: string;
  country: string; // now holds country code, e.g. "GB"
}

export interface Country {
  id: number;
  type: string;
  label: string;
  value: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
}

export interface BillingAddressFormHandle {
  getAddress: () => Address;
}

const BillingAddressForm = forwardRef<BillingAddressFormHandle>(
  (_props, ref) => {
    const isMobile = useBreakpointValue({ base: true, lg: false });
    const toast = useToast();
    const { fetchClient } = useFetchClient();
    const [loading, setLoading] = useState(false);
    const user = useUser();

    const [address, setAddress] = useState<Address>({
      address1: "",
      address2: "",
      city: "",
      county: "",
      postcode: "",
      country: "337",
    });

    // holds the fetched countries
    const [countries, setCountries] = useState<Country[]>([]);

    // load list of countries
    const fetchCountries = async () => {
      try {
        // 1) Tell TS what shape to expect:
        const data = await fetchClient<{
          country?: Array<{
            value: number; // the DB id
            label: string; // e.g. "Albania"
            name: string; // the ISO-code, e.g. "AL"
          }>;
        }>("/api/surveyjs/selectItems?type=country");

        // 2) Grab the right key (data.country) and bail if it's missing or not an array
        if (!data?.country || !Array.isArray(data.country)) {
          console.warn("Unexpected country payload:", data);
          setCountries([]);
          return;
        }

        // 3) Map into your Country interface, using `name` for the ISO code:
        setCountries(
          data.country.map((c) => ({
            id: c.value,
            type: "country",
            label: c.label,
            value: String(c.value), // ← use the DB id here
            sortOrder: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: 0,
            updatedBy: 0,
          }))
        );
      } catch (err) {
        console.error("Error fetching countries:", err);
        setCountries([]);
      }
    };

    // load the user’s saved address if it exists
    const fetchAddress = async () => {
      try {
        if (!user?.user?.customerUniqueId) {
          console.warn("No customerUniqueId found in user data.");
          return;
        }
        const params = new URLSearchParams({ uniqueId: user?.user?.customerUniqueId });
        const result = await fetchClient<{ resource?: any }>(
          `/api/customer/findBy?${params.toString()}`
        );
        if (!result || !result.resource) {
          return;
        }
        const { resource } = result;

        const {
          address1 = "",
          address2 = "",
          address3: rawCity = "",
          address4: rawCounty = "",
          postcode = "",
          country: countryCode = "",
        } = resource;

        const newAddr: Address = {
          address1,
          address2,
          city: rawCity !== "-" ? rawCity : "",
          county: rawCounty !== "-" ? rawCounty : "",
          postcode,
          country: countryCode || "",
        };

        console.log("Fetched address payload, setting to:", newAddr);
        setAddress(newAddr);
      } catch (err: any) {
        console.error("Error fetching address:", err);
        toast({
          title: "Error fetching address",
          description: err.message || "Unable to fetch your billing address.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    useEffect(() => {
      const loadData = async () => {
        setLoading(true);
        await fetchCountries();
        await fetchAddress();
        setLoading(false);
      };
      loadData();
    }, []);

    useImperativeHandle(
      ref,
      () => ({
      getAddress: () => {
        console.log("getAddress called, returning address:", address);
        return address;
      },
      }),
      [address]
    );

    const handleChange =
      (field: keyof Address) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setAddress((prev) => ({ ...prev, [field]: e.target.value }));
      };

    return (
      <Box
        bg={isMobile ? "rgba(255,255,255,0.85)" : "white"}
        borderRadius="lg"
        boxShadow="sm"
        p={6}
        mt={3}
      >
        {!isMobile && (
          <HStack justify="space-between" mb={4}>
            <Text fontSize={[14, 16, 18]} fontWeight="semibold">
              Billing Address
            </Text>
            {loading && <Spinner size="sm" />}
          </HStack>
        )}

        <form>
          <Stack spacing={3} mb={3}>
            {!loading && (
              <VStack spacing={3} align="stretch">
                <input
                  name="address1"
                  type="text"
                  placeholder="Address line 1"
                  value={address.address1}
                  onChange={handleChange("address1")}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "4px",
                    border: "1px solid #CBD5E0",
                    fontSize: "16px",
                  }}
                  required
                  autoComplete="address-line1"
                  disabled={loading}
                />
                <input
                  name="address2"
                  type="text"
                  placeholder="Address line 2 (optional)"
                  value={address.address2}
                  onChange={handleChange("address2")}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "4px",
                    border: "1px solid #CBD5E0",
                    fontSize: "16px",
                  }}
                  autoComplete="address-line2"
                  disabled={loading}
                />
                <input
                  name="city"
                  type="text"
                  placeholder="Town/City"
                  value={address.city}
                  onChange={handleChange("city")}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "4px",
                    border: "1px solid #CBD5E0",
                    fontSize: "16px",
                  }}
                  required
                  autoComplete="address-level2"
                  disabled={loading}
                />
                <input
                  name="county"
                  type="text"
                  placeholder="County (optional)"
                  value={address.county}
                  onChange={handleChange("county")}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "4px",
                    border: "1px solid #CBD5E0",
                    fontSize: "16px",
                  }}
                  autoComplete="address-level1"
                  disabled={loading}
                />
                <input
                  name="postcode"
                  type="text"
                  placeholder="Postcode"
                  value={address.postcode}
                  onChange={handleChange("postcode")}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "4px",
                    border: "1px solid #CBD5E0",
                    fontSize: "16px",
                    textTransform: "uppercase",
                  }}
                  required
                  autoComplete="postal-code"
                  disabled={loading}
                />
                <FormControl isRequired>
                  <Select
                    name="country"
                    value={address.country}
                    onChange={handleChange("country")}
                    disabled={loading}
                    placeholder="Select country"
                  >
                    {countries.map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </VStack>
            )}
          </Stack>
        </form>
      </Box>
    );
  }
);

export default BillingAddressForm;
