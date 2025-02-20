import {useState} from "react";

export type DrawerStateOptions = "closed" | "half-open" | "fully-open";

interface UseDrawerStateProps {
  initialState?: DrawerStateOptions;
}

interface UseDrawerStateReturn {
  drawerState: DrawerStateOptions;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}

const UseDrawerState = ({
  initialState = "closed",
}: UseDrawerStateProps): UseDrawerStateReturn => {
  const [drawerState, setDrawerState] =
    useState<DrawerStateOptions>(initialState);

  const closeDrawer = () => {
    setDrawerState("closed");
  };

  const openDrawer = () => {
    setDrawerState("fully-open");
  };

  const toggleDrawer = () => {
    setDrawerState((prevState) => {
      switch (prevState) {
        case "fully-open":
          return "half-open";
        case "half-open":
          return "fully-open";
        default:
          return prevState; // do nothing if "closed"
      }
    });
  };

  return {
    drawerState,
    openDrawer,
    closeDrawer,
    toggleDrawer,
  };
};

export default UseDrawerState;
