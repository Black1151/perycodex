"use client";

import { useEffect } from "react";
import { useTags } from "./TagsProvider";

interface AdminModalSubscriptionClientProps {
  recordId: string;
  recordTypeId: string;
}

export const AdminModalSubscriptionClient: React.FC<
  AdminModalSubscriptionClientProps
> = ({ recordId, recordTypeId }) => {
  const { setRecordDetails } = useTags();

  useEffect(() => {
    setRecordDetails(recordId, recordTypeId);
  }, [recordId, recordTypeId, setRecordDetails]);

  return null;
};
