import { useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: HeadersInit;
  body?: any;
  successMessage?: string;
  errorMessage?: string;
  redirectOnError?: boolean;
};

export const useFetchClient = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchClient = async <T>(
    url: string,
    {
      method = "GET",
      headers = { "Content-Type": "application/json" },
      body,
      successMessage,
      errorMessage,
      redirectOnError = true,
    }: FetchOptions = {}
  ): Promise<T | null> => {
    setLoading(true);

    try {
      const response = await fetch(url, {
        method,
        headers,
        ...(body ? { body: JSON.stringify(body) } : {}),
      });

      const data = await response.json();

      if (successMessage) {
        toast({
          title: successMessage,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }

      return data;
    } catch (error: any) {
      if (errorMessage) {
        toast({
          title: "Error",
          description: errorMessage,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }

      if (redirectOnError) {
        router.push("/error");
      }

      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchClient, loading };
};
