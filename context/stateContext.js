import { useState, createContext } from "react";

export const StateContext = createContext();

export const StateProvider = (props) => {
  const [menu, setMenu] = useState(false);
  const [card, setCard] = useState(false);

  const [bar, setBar] = useState(true);

  const stateContext = {
    menu,
    setMenu,
    bar,
    setBar,
    card,
    setCard,
  };

  return (
    <StateContext.Provider value={stateContext}>
      {props.children}
    </StateContext.Provider>
  );
};
