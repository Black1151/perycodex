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
      headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body,
      successMessage,
      errorMessage = "An unexpected error occurred.",
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
      console.log("FETCH CLIENT RESPONSE", response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || errorMessage);
      }

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
      console.log("FETCH CLIENT ERROR", error);
      console.error(error);
      toast({
        title: "Error",
        description: error.message || errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });

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
