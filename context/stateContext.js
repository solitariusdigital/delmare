import { useState, createContext } from "react";

export const StateContext = createContext();

export const StateProvider = (props) => {
  const [userLogIn, setUserLogin] = useState(false);
  const [menu, setMenu] = useState(false);
  const [toggleContainer, setToggleContainer] = useState(
    "empty" ||
      "screen" ||
      "wish" ||
      "account" ||
      "cart" ||
      "orders" ||
      "transactions"
  );
  const [displayProduct, setDisplayProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [bar, setBar] = useState(true);
  const [shoppingCart, setShoppingCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [navigation, setNavigation] = useState([
    {
      title: "New",
      link: "/collections/new",
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

  // application context
  const [appUsers, setAppUsers] = useState([]);
  const [currentUser, seCurrentUser] = useState(null);

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
    displayProduct,
    setDisplayProduct,
    selectedProduct,
    setSelectedProduct,
    userLogIn,
    setUserLogin,
    isLoading,
    setIsLoading,
    currentUser,
    seCurrentUser,
    appUsers,
    setAppUsers,
  };

  return (
    <StateContext.Provider value={stateContext}>
      {props.children}
    </StateContext.Provider>
  );
};
