import React from "react";
import ToolStore from "./ToolStore";
import { BasketProvider } from "./BasketContext";

const ToolStorePage = () => {
  return (
    <BasketProvider>
      <ToolStore resource={[]} />
    </BasketProvider>
  );
};

export default ToolStorePage;
