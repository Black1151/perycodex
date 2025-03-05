// hooks/useNavMenuItems.ts
import { useRouter } from "next/navigation";
import { MenuItemProps } from "@/components/NavBar/components/types";
import {
  Home as HomeIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Timeline,
  Celebration,
  Lock as LockIcon,
  ExitToApp as ExitToAppIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";

const useNavMenuItems = (
  userRole: string,
  handleLogout: () => void,
  openResetModal: () => void
): MenuItemProps[] => {
  const router = useRouter();

  if (userRole === "EU") {
    return [
      {
        label: "Logout",
        icon: <ExitToAppIcon />,
        onClick: handleLogout,
      },
    ];
  }

  const commonMenuItems: MenuItemProps[] = [
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
    {
      label: "Activity",
      icon: <Timeline />,
      onClick: () => router.push("/activity"),
    },
    {
      label: "Recognition Hub",
      icon: <Celebration />,
      onClick: () => router.push("/big-up"),
    },
    {
      label: "Reset Password",
      icon: <LockIcon />,
      onClick: openResetModal,
    },
    {
      label: "Logout",
      icon: <ExitToAppIcon />,
      onClick: handleLogout,
    },
  ];

  if (userRole === "PA") {
    return [
      {
        label: "Admin",
        icon: <SettingsIcon />,
        onClick: () => router.push("/customers"),
      },
      ...commonMenuItems,
    ];
  } else if (userRole === "CA") {
    return [
      {
        label: "Admin Tools",
        icon: <SettingsIcon />,
        onClick: () => router.push("/users?userType=internal"),
      },
      ...commonMenuItems,
    ];
  } else {
    return commonMenuItems;
  }
};

export default useNavMenuItems;
