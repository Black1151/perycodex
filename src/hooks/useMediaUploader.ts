import { ChangeEvent, useState } from "react";
import { useToast } from "@chakra-ui/react";

interface UseMediaUploaderReturn {
  isUploading: boolean;
  handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const useMediaUploader = (
  endpoint: string,
  formKey: string,
  onSuccess: () => void,
  maxFileSize: number = 2 * 1024 * 1024, // Default to 2MB
  allowedFileTypes: string[] = ["image/jpeg", "image/png", "image/jpg"], // Common file types for photos/logos
): UseMediaUploaderReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const toast = useToast();

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!allowedFileTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a valid image file (JPEG, PNG).",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
      return false;
    }

    // Check file size
    if (file.size > maxFileSize) {
      toast({
        title: "File too large",
        description: `File size must be less than ${(maxFileSize / (1024 * 1024)).toFixed(2)}MB.`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
      return false;
    }

    return true;
  };

  const uploadMedia = async (file: File) => {
    setIsUploading(true); // Start uploading state
    const formData = new FormData();
    formData.append(formKey, file); // Append file to the form data

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData, // The browser automatically sets the correct headers for FormData
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const data = await response.json(); // Assuming API returns JSON
      toast({
        title: "Upload successful",
        description: "Your file has been uploaded successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
      onSuccess(); // Execute the callback on success
    } catch (error) {
      toast({
        title: "Upload failed",
        description:
          "There was an error uploading your file. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
      console.error("File upload error:", error);
    } finally {
      setIsUploading(false); // Stop uploading state
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const isValid = validateFile(file);
      if (isValid) {
        await uploadMedia(file);
      }
    }
    event.target.value = ""; // Clear the file input after processing
  };

  return {
    isUploading: isUploading,
    handleFileChange,
  };
};
