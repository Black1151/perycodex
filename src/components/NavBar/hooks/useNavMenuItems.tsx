import { useRouter } from "next/navigation";
import { MenuItemProps } from "@/components/NavBar/components/types";
import {
  Home as HomeIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Timeline,
  ViewTimeline,
  Celebration,
  Lock as LockIcon,
  ExitToApp as ExitToAppIcon,
  Settings as SettingsIcon,
  Storefront as StorefrontIcon,
} from "@mui/icons-material";
import { useUser } from "@/providers/UserProvider";

const useNavMenuItems = (
  userRole: string,
  handleLogout: () => void,
  openResetModal: () => void
): MenuItemProps[] => {
  const router = useRouter();
  const user = useUser()

  if (userRole === "EU") {
    return [
      {
        label: "Logout",
        icon: <ExitToAppIcon />,
        onClick: handleLogout,
      },
    ];
  }

  if (userRole === "PA") {
    return [
      {
        label: "Admin",
        icon: <SettingsIcon />,
        onClick: () => router.push("/customers"),
      }
    ];
  }

  const commonMenuItems: MenuItemProps[] = [];
  if (userRole === "CA") {
    commonMenuItems.push({
      label: "Admin Tools",
      icon: <SettingsIcon />,
      onClick: () => router.push("/users?userType=internal"),
    },
    {
      label: "Tool Store",
      icon: <StorefrontIcon />,
      onClick: () => router.push("/tool-store"),  
    }
  );
  }
  commonMenuItems.push(
    {
      label: "My Tools",
      icon: <HomeIcon />,
      onClick: () => router.push("/"),
    },
    {
      label: "My Profile",
      icon: <PersonIcon />,
      onClick: () => router.push("/my-profile"),
    },
    {
      label: "My Company",
      icon: <BusinessIcon />,
      onClick: () => router.push("/my-company"),
    },
  );
  if (!user.user?.customerIsFree) {
    commonMenuItems.push(
      {
      label: "Activity",
      icon: <Timeline />,
      onClick: () => router.push("/activity"),
    }
    )
  }
  if (["CS", "CL", "CA"].includes(userRole) && !user.user?.customerIsFree) {
    commonMenuItems.push(
    {
      label: "Client Activity",
      icon: <ViewTimeline />,
      onClick: () => router.push("/client-activity"),
    },
  );
  }
  commonMenuItems.push(
    {
      label: "Recognition Hub",
      icon: <Celebration />,
      onClick: () => router.push("/big-up"),
    },
    {
      label: "Reset Password",
      icon: <LockIcon />,
      onClick: openResetModal,
    }
  );
  return commonMenuItems;
};

export default useNavMenuItems;
