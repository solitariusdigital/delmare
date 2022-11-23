import { useState, createContext } from "react";
export const StateContext = createContext();

export const StateProvider = (props) => {
  const [menu, setMenu] = useState(false);
  const [register, setRegister] = useState(false);
  const [search, setSearch] = useState(false);
  const [searchControl, setSearchControl] = useState(false);
  const [bar, setBar] = useState(true);
  const [container, setContainer] = useState(true);
  const [toggleContainer, setToggleContainer] = useState(
    "empty" || "screen" || "wish" || "account" || "cart" || "orders" || "about"
  );
  const [displayProduct, setDisplayProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [shoppingCart, setShoppingCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [navigation, setNavigation] = useState([
    {
      title: "Gallery",
      link: "/collections/gallery",
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
  ]);
  const [categories, setCategories] = useState([
    "اسکارف",
    "اکسسوری",
    "بارونی",
    "بلوز",
    "پالتو",
    "تاپ",
    "جین",
    "ست",
    "شلوار",
    "شومیز",
    "عینک",
    "کاپشن",
    "کت",
    "کفش",
    "کلاه",
    "کیف",
    "هودی",
  ]);
  const [seasons, setSeasons] = useState([
    "بهار",
    "تابستان",
    "پاییز",
    "زمستان",
    "همه فصول",
  ]);
  const [kavenegarKey, setKavenegarKey] = useState(
    "684E475442526B426237454A7836434D42394F3368324463527569754F4453616B386B2F573756303439413D"
  );

  // application context
  const [userLogIn, setUserLogin] = useState(false);
  const [appUsers, setAppUsers] = useState([]);
  const [currentUser, seCurrentUser] = useState(null);
  const [productsCollection, setProductsCollection] = useState([]);
  const [galleryCollection, setGalleryCollection] = useState([]);
  const [saleCollection, setSaleCollection] = useState([]);

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
    container,
    setContainer,
    productsCollection,
    setProductsCollection,
    register,
    setRegister,
    saleCollection,
    setSaleCollection,
    galleryCollection,
    setGalleryCollection,
    categories,
    setCategories,
    seasons,
    setSeasons,
    search,
    setSearch,
    searchControl,
    setSearchControl,
    kavenegarKey,
    setKavenegarKey,
  };

  return (
    <StateContext.Provider value={stateContext}>
      {props.children}
    </StateContext.Provider>
  );
};
