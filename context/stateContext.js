import { useState, createContext } from "react";

export const StateContext = createContext();

export const StateProvider = (props) => {
  const [menu, setMenu] = useState(false);
  const [admin, setAdmin] = useState(false);

  const stateContext = {
    menu,
    setMenu,
    admin,
    setAdmin,
  };

  return (
    <StateContext.Provider value={stateContext}>
      {props.children}
    </StateContext.Provider>
  );
};
