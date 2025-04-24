"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  Box,
  Flex,
  VStack,
  Spinner,
  Image,
  Text,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import AddAPhotoOutlinedIcon from "@mui/icons-material/AddAPhotoOutlined";
import { BusinessOutlined } from "@mui/icons-material";
import { useUser } from "@/providers/UserProvider";
import { useMediaUploader } from "@/hooks/useMediaUploader";

export default function LogoUpload() {
  const { user } = useUser();
  if (!user) return null;

  const customerUId = user.customerUniqueId!;
  const customerName = user.customerName!;

  // Local preview URL
  const [customerImgUrl, setCustomerImgUrl] = useState(
    user.custImageUrl || ""
  );

  // Pull out only the upload fn & loading state
  const { isUploading, uploadMediaFile } = useMediaUploader(
    `/api/customer/uploadPhoto/${customerUId}`,
    "imageUrl",
    () => {}             // noop, we handle preview ourselves
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const borderColor = useColorModeValue("gray.400", "gray.600");
  const hoverBorderColor = useColorModeValue("gray.200", "gray.400");

  // Helper: given the API response, pick the new URL
  const extractUrl = (data: any): string => {
    // adjust these to match your API shape!
    return (
      data.imageUrl ||
      data.url ||
      data.resource?.imageUrl ||
      customerImgUrl
    );
  };

  // When you click “Browse files”
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    // 1️⃣ Immediately preview the local file
    const localUrl = URL.createObjectURL(file);
    setCustomerImgUrl(localUrl);
  
    try {
      // 2️⃣ Upload to server
      const data = await uploadMediaFile(file);
      // 3️⃣ Then replace the preview with your server's URL
      const newUrl = extractUrl(data);
      setCustomerImgUrl(newUrl);
    } catch {
      // hook already toasted
    }
    e.target.value = "";
  };
  
  // Drag & drop handlers
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);
  const onDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file) {
        try {
          const data = await uploadMediaFile(file);
          const newUrl = extractUrl(data);
          setCustomerImgUrl(newUrl);
        } catch {
          // error toast already shown
        }
      }
    },
    [uploadMediaFile]
  );

  return (
    <VStack w="100%" align="center" spacing={4}>
      <Box
        w="100%"
        maxW="400px"
        p={6}
        border="2px dashed"
        background={"rgba(255, 255, 255, 0.1)"}
        borderColor={borderColor}
        borderRadius="md"
        textAlign="center"
        position="relative"
        cursor="pointer"
        _hover={{ borderColor: hoverBorderColor }}
        onClick={() => inputRef.current?.click()}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        {/* Spinner overlay */}
        {isUploading && (
          <Flex
            position="absolute"
            inset={0}
            bg="rgba(255,255,255,0.8)"
            align="center"
            justify="center"
            borderRadius="md"
            zIndex={2}
          >
            <Spinner size="lg" />
          </Flex>
        )}

        {/* Preview or placeholder */}
        <Box mb={4}>
            {customerImgUrl && (
            <Image
              src={customerImgUrl}
              alt={customerName}
              maxH="100px"
              mx="auto"
            />
            )}
        </Box>

        {/* Instructions */}
        <Text color="white" fontSize={18}>
            Drag & drop your logo here.
          </Text>

        {/* Browse files button */}
        <Button
          size="sm"
          colorScheme="blue"
          mt={4}
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
        >
          or, Browse files
        </Button>

        {/* Hidden file input */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={onFileChange}
          disabled={isUploading}
        />
      </Box>
    </VStack>
  );
}
