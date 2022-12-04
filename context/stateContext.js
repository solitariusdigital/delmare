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
      title: "گالری",
      link: "/collections/gallery",
      active: false,
    },
    {
      title: "تخفیف",
      link: "/collections/sale",
      active: false,
    },
    {
      title: "اکسسوری",
      link: "/collections/accessories",
      active: false,
    },
    {
      title: "برند",
      link: "/collections/brands",
      active: false,
    },
  ]);
  const [generalCategories, setGeneralCategories] = useState([
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
    "کت شلوار",
    "کفش",
    "کلاه",
    "کیف",
    "هودی",
  ]);
  const [accessoriesCategories, setAccessoriesCategories] = useState([
    "اکسسوری",
    "عینک",
    "کلاه",
    "کیف",
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
  const [accessoriesCollection, setAccessoriesCollection] = useState([]);

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
    generalCategories,
    setGeneralCategories,
    accessoriesCategories,
    setAccessoriesCategories,
    seasons,
    setSeasons,
    search,
    setSearch,
    searchControl,
    setSearchControl,
    kavenegarKey,
    setKavenegarKey,
    accessoriesCollection,
    setAccessoriesCollection,
  };

  return (
    <StateContext.Provider value={stateContext}>
      {props.children}
    </StateContext.Provider>
  );
};
