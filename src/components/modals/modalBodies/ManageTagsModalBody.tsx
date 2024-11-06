"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Select,
  Text,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Spinner,
} from "@chakra-ui/react";
import { Tag } from "@/components/AdminDetailsBanners/TagDetailsBanner";
import { useFetchClient } from "@/hooks/useFetchClient";
import { useRouter } from "next/navigation";
import { useTags } from "@/providers/TagsProvider";

interface ManageTagsModalBodyProps {
  customerId: number;
  onClose: () => void;
}

export function ManageTagsModalBody({
  customerId,
  onClose,
}: ManageTagsModalBodyProps) {
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTagId, setSelectedTagId] = useState<string>("");
  const [selectedTagToRemoveId, setSelectedTagToRemoveId] =
    useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { fetchClient } = useFetchClient();
  const router = useRouter();
  const { tags, setTags } = useTags();
  const { recordId, recordTypeId } = useTags();

  useEffect(() => {
    const fetchAvailableTags = async () => {
      setIsLoading(true);
      setError("");

      const data = await fetchClient<{ resource: Tag[] }>(
        "/api/tags/getTagsAvailableToAddToRecord",
        {
          method: "POST",
          body: { customerId, recordTypeId, recordId },
          errorMessage: "Failed to fetch available tags",
          redirectOnError: false,
        }
      );

      if (data) {
        setAvailableTags(data.resource);
      }

      setIsLoading(false);
    };
    fetchAvailableTags();
  }, []);

  const handleAddTag = async () => {
    if (!selectedTagId) {
      setError("Please select a tag");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/tags/addTagToRecord/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recordId,
          recordTypeId,
          tagId: selectedTagId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add tag to record");
      }
      const newTagsResponse = await fetchClient<{ resource: Tag[] }>(
        `/api/tags/getTagsForRecord?recordTypeId=${recordTypeId}&recordId=${recordId}`,
        {
          method: "GET",
          redirectOnError: false,
        }
      );

      if (newTagsResponse) {
        setTags(newTagsResponse.resource);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveTag = async () => {
    if (!selectedTagToRemoveId) {
      setError("Please select a tag to remove");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/tags/removeTagFromRecord/${selectedTagToRemoveId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to remove tag from record");
      }

      // Fetch the new tags after successful removal
      const newTagsResponse = await fetchClient<{ resource: Tag[] }>(
        `/api/tags/getTagsForRecord?recordTypeId=${recordTypeId}&recordId=${recordId}`,
        {
          method: "GET",
          redirectOnError: false,
        }
      );

      if (newTagsResponse) {
        setTags(newTagsResponse.resource);
      }

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Box
        height={170}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner />
      </Box>
    );
  }

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  return (
    <Tabs>
      <TabList>
        <Tab>Add Tags</Tab>
        <Tab>Remove Tags</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <VStack spacing={4} align="stretch">
            <Box>
              <Select
                placeholder="Select a tag to add"
                value={selectedTagId}
                onChange={(e) => {
                  setSelectedTagId(e.target.value);
                }}
              >
                {availableTags.map((tag: Tag) => {
                  return (
                    <option key={tag.id} value={String(tag.id)}>
                      {tag.name}
                    </option>
                  );
                })}
              </Select>
            </Box>

            <Button
              colorScheme="blue"
              onClick={handleAddTag}
              isDisabled={!selectedTagId}
            >
              Add Tag
            </Button>
          </VStack>
        </TabPanel>

        <TabPanel>
          <VStack spacing={4} align="stretch">
            <Box>
              <Select
                placeholder="Select a tag to remove"
                value={selectedTagToRemoveId}
                onChange={(e) => {
                  setSelectedTagToRemoveId(e.target.value);
                }}
              >
                {tags.map((tag: any) => (
                  <option key={tag.id} value={tag.tagAssocId}>
                    {tag.name}
                  </option>
                ))}
              </Select>
            </Box>

            <Button
              colorScheme="red"
              onClick={handleRemoveTag}
              isDisabled={!selectedTagToRemoveId}
            >
              Remove Tag
            </Button>
          </VStack>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
