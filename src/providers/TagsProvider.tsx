"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { Tag } from "@/components/AdminDetailsBanners/TagDetailsBanner";

interface TagsContextType {
  recordId?: string;
  recordTypeId?: string;
  tags: Tag[];
  setRecordDetails: (recordId: string, recordTypeId: string) => void;
  setTags: (tags: Tag[]) => void;
}

const TagsContext = createContext<TagsContextType | undefined>(undefined);

interface TagsProviderProps {
  children: ReactNode;
}

export function TagsProvider({ children }: TagsProviderProps) {
  const [recordId, setRecordId] = useState<string>();
  const [recordTypeId, setRecordTypeId] = useState<string>();
  const [tags, setTags] = useState<Tag[]>([]);

  const setRecordDetails = (recordId: string, recordTypeId: string) => {
    setRecordId(recordId);
    setRecordTypeId(recordTypeId);
  };

  return (
    <TagsContext.Provider
      value={{
        recordId,
        recordTypeId,
        tags,
        setRecordDetails,
        setTags,
      }}
    >
      {children}
    </TagsContext.Provider>
  );
}

export function useTags() {
  const context = useContext(TagsContext);
  if (context === undefined) {
    throw new Error("useTags must be used within a TagsProvider");
  }
  return context;
}
