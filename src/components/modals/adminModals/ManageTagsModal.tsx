"use client";

import { PerygonModal } from "@/components/modals/PerygonModal";
import { ManageTagsModalBody } from "../modalBodies/ManageTagsModalBody";

interface ManageTagsModalProps {
  customerId: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function ManageTagsModal({
  customerId,
  isOpen,
  setIsOpen,
}: ManageTagsModalProps) {
  return (
    <PerygonModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Manage Tags"
      body={
        <ManageTagsModalBody
          customerId={customerId}
          onClose={() => setIsOpen(false)}
        />
      }
    />
  );
}
