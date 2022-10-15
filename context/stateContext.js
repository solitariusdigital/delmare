import { useState, createContext } from "react";

export const StateContext = createContext();

export const StateProvider = (props) => {
  const [menu, setMenu] = useState(false);
  const [toggleContainer, setToggleContainer] = useState(
    "account" || "cart" || "wish" || "orders" || "transactions" || ""
  );

  const [bar, setBar] = useState(true);
  const [shoppingCart, setShoppingCart] = useState([]);
  const [navigation, setNavigation] = useState([
    {
      title: "New",
      link: "/collections/new",
      active: false,
    },
    {
      title: "Sale",
      link: "/collections/sale",
      active: false,
    },
    {
      title: "Brands",
      link: "/collections/brands",
      active: false,
    },
    {
      title: "Bloggers",
      link: "/collections/bloggers",
      active: false,
    },
  ]);

  const stateContext = {
    menu,
    setMenu,
    bar,
    setBar,
    shoppingCart,
    setShoppingCart,
    navigation,
    setNavigation,
    toggleContainer,
    setToggleContainer,
  };

  return (
    <StateContext.Provider value={stateContext}>
      {props.children}
    </StateContext.Provider>
  );
};
