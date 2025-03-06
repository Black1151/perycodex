// hooks/useUnreadStatus.ts
import { useState, useEffect } from "react";

const useUnreadStatus = () => {
  const [unread, setUnread] = useState(false);

  useEffect(() => {
    const checkUnread = async () => {
      const response = await fetch("/api/auth/big-up/checkUnread");
      const data = await response.json();
      if (data.amount > 0) {
        setUnread(true);
      } else {
        setUnread(false);
      }
    };
    checkUnread();
  }, []);

  return unread;
};

export default useUnreadStatus;
