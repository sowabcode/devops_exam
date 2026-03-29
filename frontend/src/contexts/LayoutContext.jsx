import { useState, createContext } from "react";
const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <LayoutContext.Provider
      value={{
        showSidebar,
        setShowSidebar,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export default LayoutContext;
