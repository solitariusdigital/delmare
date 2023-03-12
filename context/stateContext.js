import { useState, createContext } from "react";
export const StateContext = createContext();

export const StateProvider = (props) => {
  const [menu, setMenu] = useState(false);
  const [register, setRegister] = useState(false);
  const [search, setSearch] = useState(false);
  const [searchControl, setSearchControl] = useState(false);
  const [bar, setBar] = useState(false);
  const [container, setContainer] = useState(true);
  const [toggleContainer, setToggleContainer] = useState(
    "empty" ||
      "screen" ||
      "wish" ||
      "account" ||
      "cart" ||
      "orders" ||
      "about" ||
      "download" ||
      "follow"
  );
  const [selectedProduct, setSelectedProduct] = useState({});
  const [shoppingCart, setShoppingCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [navigation, setNavigation] = useState([
    {
      title: "گالری",
      collection: "gallery",
      link: "/collections/gallery",
      active: false,
    },
    {
      title: "تخفیف",
      collection: "sale",
      link: "/collections/sale",
      active: false,
    },
    {
      title: "اکسسوری",
      collection: "accessories",
      link: "/collections/accessories",
      active: false,
    },
    {
      title: "کفش",
      collection: "shoes",
      link: "/collections/shoes",
      active: false,
    },
    {
      title: "بلاگرز",
      collection: "bloggers",
      link: "/collections/bloggers",
      active: false,
    },
    {
      title: "برندز",
      collection: "brands",
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
    "تیشرت",
    "جین",
    "ساعت",
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
    "مانتو",
    "وست",
    "هودی",
  ]);
  const [accessoriesCategories, setAccessoriesCategories] = useState([
    "اکسسوری",
    "ساعت",
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
  const [currentUser, setCurrentUser] = useState(null);
  const [gallery, setGallery] = useState([]);

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
    selectedProduct,
    setSelectedProduct,
    userLogIn,
    setUserLogin,
    isLoading,
    setIsLoading,
    currentUser,
    setCurrentUser,
    appUsers,
    setAppUsers,
    container,
    setContainer,
    register,
    setRegister,
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
    gallery,
    setGallery,
  };

  return (
    <StateContext.Provider value={stateContext}>
      {props.children}
    </StateContext.Provider>
  );
};
