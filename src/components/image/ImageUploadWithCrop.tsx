"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  FormControl,
  FormLabel,
  VStack,
  HStack,
  Box,
  Button,
  Text,
  Image,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import CloseIcon from "@mui/icons-material/Close";
import ImageCropper from "./ImageCropper";

interface Props {
  label: string;
  onFileSelected?: (file: File | null) => void;
  onFilesSelected?: (files: File[]) => void;
  isRequired?: boolean;
  /** Existing image URL to display when editing */
  existingUrl?: string;
  /** Called when an existing image is removed */
  onRemoveExisting?: () => void;
  /** Allow selecting multiple images */
  multiple?: boolean;
}

export default function ImageUploadWithCrop({
  label,
  onFileSelected,
  onFilesSelected,
  isRequired = false,
  existingUrl,
  onRemoveExisting,
  multiple = false,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [fileQueue, setFileQueue] = useState<File[]>([]);
  const [croppedFiles, setCroppedFiles] = useState<File[]>([]);
  const [cropOpen, setCropOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [usingExisting, setUsingExisting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const borderColor = useColorModeValue("gray.400", "gray.600");
  const hoverBorderColor = useColorModeValue("gray.200", "gray.400");

  const handleFiles = (files: FileList | File[]) => {
    const arr = Array.from(files);
    if (multiple) {
      setFileQueue((q) => [...q, ...arr]);
      if (!file) {
        const next = arr[0];
        if (next) {
          setFile(next);
          setCropOpen(true);
        }
      }
    } else {
      const f = arr[0];
      if (f) {
        setFile(f);
        setCropOpen(true);
      }
    }
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
    e.target.value = "";
  };

  const handleComplete = (cropped: File) => {
    setCropOpen(false);
    setFile(null);
    if (multiple) {
      setFileQueue((q) => q.slice(1));
      setCroppedFiles((prev) => {
        const updated = [...prev, cropped];
        onFilesSelected?.(updated);
        return updated;
      });
      setPreviewUrls((prev) => [...prev, URL.createObjectURL(cropped)]);
    } else {
      setPreviewUrl(URL.createObjectURL(cropped));
      setUsingExisting(false);
      onFileSelected?.(cropped);
    }
  };

  const handleCancel = () => {
    setCropOpen(false);
    if (multiple) {
      setFileQueue((q) => q.slice(1));
    }
    setFile(null);
  };

  const handleRemove = (e: React.MouseEvent, index?: number) => {
    e.stopPropagation();
    if (multiple) {
      if (index !== undefined) {
        setCroppedFiles((prev) => {
          const updated = prev.filter((_, i) => i !== index);
          onFilesSelected?.(updated);
          return updated;
        });
        setPreviewUrls((prev) => {
          URL.revokeObjectURL(prev[index]);
          return prev.filter((_, i) => i !== index);
        });
      }
    } else {
      if (usingExisting && onRemoveExisting) {
        onRemoveExisting();
      }
      setPreviewUrl("");
      setUsingExisting(false);
      setFile(null);
      onFileSelected?.(null);
    }
  };

  useEffect(() => {
    if (existingUrl) {
      setPreviewUrl(existingUrl);
      setUsingExisting(true);
    } else {
      setPreviewUrl("");
      setUsingExisting(false);
    }
  }, [existingUrl]);

  useEffect(() => {
    if (multiple && !file && fileQueue.length > 0) {
      setFile(fileQueue[0]);
      setCropOpen(true);
    }
  }, [multiple, fileQueue, file]);

  return (
    <FormControl mb={4} isRequired={isRequired}>
      <FormLabel>{label}</FormLabel>
      <VStack w="100%" align="center" spacing={4}>
        <Box
          w="100%"
          maxW="400px"
          p={6}
          border="2px dashed"
          background="rgba(255, 255, 255, 0.1)"
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
          {(!multiple && previewUrl) && (
            <IconButton
              aria-label="Remove"
              icon={<CloseIcon />}
              size="sm"
              color="red.500"
              variant="ghost"
              position="absolute"
              top={2}
              right={2}
              onClick={handleRemove}
            />
          )}
          <Box mb={4}>
            {!multiple && previewUrl ? (
              <Image src={previewUrl} alt="preview" maxH="100px" mx="auto" />
            ) : (
              <Text color="white" fontSize={18}>
                {multiple ? "Drag & drop images here" : "Drag & drop image here"}
              </Text>
            )}
          </Box>
          <Button
            size="sm"
            variant="primary"
            mt={!multiple && previewUrl ? 0 : 4}
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
          >
            {!multiple && previewUrl ? "Change Image" : "Browse files"}
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple={multiple}
            style={{ display: "none" }}
            onChange={handleChange}
          />
        </Box>
        {multiple && previewUrls.length > 0 && (
          <HStack flexWrap="wrap" spacing={2} w="100%">
            {previewUrls.map((url, idx) => (
              <Box key={idx} position="relative">
                <IconButton
                  aria-label="Remove"
                  icon={<CloseIcon />}
                  size="xs"
                  color="red.500"
                  variant="ghost"
                  position="absolute"
                  top={1}
                  right={1}
                  onClick={(e) => handleRemove(e, idx)}
                />
                <Image src={url} alt={`preview-${idx}`} maxH="100px" />
              </Box>
            ))}
          </HStack>
        )}
      </VStack>
      <ImageCropper
        file={file}
        isOpen={cropOpen}
        onCancel={handleCancel}
        onComplete={handleComplete}
      />
    </FormControl>
  );
}
