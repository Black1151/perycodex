"use client";

import { HStack } from "@chakra-ui/react";
import { Tag } from "./Tag";

interface TagsDisplayProps {
  tags: {
    id: number;
    name: string;
    colour: string;
  }[];
}

export const TagsDisplay = ({ tags }: TagsDisplayProps) => {
  console.log(tags[0]);

  return (
    <HStack>
      {tags.map((tag) => (
        <Tag key={tag.id} id={tag.id} name={tag.name} colour={tag.colour} />
      ))}
    </HStack>
  );
};
