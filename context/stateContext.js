import { useState, createContext } from "react";
export const StateContext = createContext();

export const StateProvider = (props) => {
  const [menu, setMenu] = useState(false);
  const [register, setRegister] = useState(false);
  const [search, setSearch] = useState(false);
  const [searchControl, setSearchControl] = useState(false);
  const [bar, setBar] = useState(false);
  const [container, setContainer] = useState(true);
  const [navigationBottom, setNavigationBottom] = useState(true);
  const [toggleType, setToggleType] = useState("clothing" || "care");
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
  const [referralData, setReferralData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [navigationTopBar, setNavigationTopBar] = useState([
    {
      title: "گالری",
      collection: "gallery",
      link: "/collections/gallery",
      active: false,
      type: "clothing",
    },
    {
      title: "تخفیف",
      collection: "sale",
      link: "/collections/sale",
      active: false,
      type: "clothing",
    },
    {
      title: "اکسسوری",
      collection: "accessories",
      link: "/collections/accessories",
      active: false,
      type: "clothing",
    },
    {
      title: "کفش",
      collection: "shoes",
      link: "/collections/shoes",
      active: false,
      type: "clothing",
    },
    {
      title: "بلاگرز",
      collection: "bloggers",
      link: "/collections/bloggers",
      active: false,
      type: "clothing",
    },
    {
      title: "برندز",
      collection: "brands",
      link: "/collections/brands",
      active: false,
      type: "clothing",
    },
    // {
    //   title: "مو",
    //   collection: "hair",
    //   link: "/collections/hair",
    //   active: false,
    //   type: "care",
    // },
    {
      title: "صورت",
      collection: "skin",
      link: "/collections/skin",
      active: false,
      type: "care",
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
    "دامن",
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
  const [reqNumber, setReqNumber] = useState(20);

  const stateContext = {
    setReqNumber,
    reqNumber,
    menu,
    setMenu,
    bar,
    setBar,
    shoppingCart,
    setShoppingCart,
    navigationTopBar,
    setNavigationTopBar,
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
    navigationBottom,
    setNavigationBottom,
    toggleType,
    setToggleType,
    referralData,
    setReferralData,
  };

  return (
    <StateContext.Provider value={stateContext}>
      {props.children}
    </StateContext.Provider>
  );
};
