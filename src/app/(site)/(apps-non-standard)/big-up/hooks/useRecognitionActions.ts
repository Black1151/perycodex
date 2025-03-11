"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/providers/UserProvider";

/** The data structure for a new recognition form submission */
interface RecognitionFormData {
  teamMember: string;
  category: string;
  message: string;
}

export function useRecognitionActions(fetchDashboardData: () => void) {
  // Local state for the success modal & confetti
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const router = useRouter();
  const { user } = useUser();

  /**
   * Mark unread recognitions as read
   */
  const markAsRead = useCallback(async () => {
    try {
      await fetch(`/api/auth/big-up/markAsRead`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("An error occurred while marking as read:", error);
    }
  }, []);

  /**
   * Submit a new recognition to the server
   */
  const handleSubmitRecognition = useCallback(
    async (formData: RecognitionFormData) => {
      try {
        await fetch("/api/auth/big-up/submitBigUp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fromUserId: user?.userId,
            toUserId: formData.teamMember,
            reason: formData.message,
            bigupTypeId: formData.category,
            customerId: user?.customerId,
          }),
        });

        fetchDashboardData();

        setShowSuccessModal(true);
        setShowConfetti(true);

        setTimeout(() => {
          setShowSuccessModal(false);
          setShowConfetti(false);
          router.refresh();
        }, 8000);
      } catch (error) {
        console.error("Error submitting BigUp:", error);
      }
    },
    [user, router, fetchDashboardData]
  );

  return {
    showSuccessModal,
    setShowSuccessModal,
    showConfetti,
    setShowConfetti,
    markAsRead,
    handleSubmitRecognition,
  };
}
