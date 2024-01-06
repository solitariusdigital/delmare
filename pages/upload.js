import { Fragment, useContext, useEffect, useState } from "react";
import { StateContext } from "../context/stateContext";
import Image from "next/legacy/image";
import CloseIcon from "@mui/icons-material/Close";
import classes from "./page.module.scss";
import { sixGenerator } from "../services/utility";
import loadingImage from "../assets/loader.png";
import Router from "next/router";
import dbConnect from "../services/dbConnect";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import RefreshIcon from "@mui/icons-material/Refresh";
import { getBrandsApi, updateBrandApi } from "../services/api";
import Head from "next/head";
import secureLocalStorage from "react-secure-storage";
import { convertNumber, calculatePercentage } from "../services/utility";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

export default function Upload() {
  const sizeInitialState = {
    FS: { colors: {} },
    XS: { colors: {} },
    S: { colors: {} },
    M: { colors: {} },
    L: { colors: {} },
    XL: { colors: {} },
    34: { colors: {} },
    35: { colors: {} },
    36: { colors: {} },
    37: { colors: {} },
    38: { colors: {} },
    39: { colors: {} },
    40: { colors: {} },
    41: { colors: {} },
    42: { colors: {} },
    43: { colors: {} },
    44: { colors: {} },
    45: { colors: {} },
  };
  const imageInitialState = {
    main: "",
    one: "",
    two: "",
    three: "",
    table: "",
    graph: "",
  };

  const { container, setContainer } = useContext(StateContext);
  const { generalCategories, setGeneralCategories } = useContext(StateContext);
  const { seasons, setSeasons } = useContext(StateContext);
  const { navigationBottom, setNavigationBottom } = useContext(StateContext);

  const [uploadClicked, setUploadClicked] = useState(false);
  const [alert, setAlert] = useState("");
  const [displayPage, setDisplayPage] = useState(false);

  const [mainImage, setMainImage] = useState("");
  const [imageOne, setImageOne] = useState("");
  const [imageTwo, setImageTwo] = useState("");
  const [imageThree, setImageThree] = useState("");
  const [table, setTable] = useState("");

  // clothing size
  const [FS, setFS] = useState("");
  const [XS, setXS] = useState("");
  const [S, setS] = useState("");
  const [M, setM] = useState("");
  const [L, setL] = useState("");
  const [XL, setXL] = useState("");
  // shoes size
  const [size34, setSize34] = useState("");
  const [size35, setSize35] = useState("");
  const [size36, setSize36] = useState("");
  const [size37, setSize37] = useState("");
  const [size38, setSize38] = useState("");
  const [size39, setSize39] = useState("");
  const [size40, setSize40] = useState("");
  const [size41, setSize41] = useState("");
  const [size42, setSize42] = useState("");
  const [size43, setSize43] = useState("");
  const [size44, setSize44] = useState("");
  const [size45, setSize45] = useState("");

  const [productCategory, setProductCategory] = useState("clothing" || "care");
  const [categorySize, setCategorySize] = useState(
    "clothesSize" || "shoesSize"
  );

  // data to save into db
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [percentage, setPercentage] = useState("");
  const [sale, setSale] = useState(false);
  const [delmareId, setDelmareId] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [season, setSeason] = useState("");
  const [brandType, setBrandType] = useState("");
  const [deliveryType, setDeliveryType] = useState("");

  const [size, setSize] = useState(sizeInitialState);
  const [images, setImages] = useState(imageInitialState);
  const [clothesBrands, setClothesBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [sizeGraph, setSizeGraph] = useState("");
  // care products
  const [careType, setCareType] = useState("");
  const [careSize, setCareSize] = useState("");
  const [careCountry, setCareCountry] = useState("");
  const [careCount, setCareCount] = useState("");
  const careCategories = ["مراقبت مو", "مراقبت صورت"];
  const careTypes = {
    "مراقبت صورت": {
      group: [
        "پاک کننده دور چشم",
        "ماسک صورت",
        "کرم و فابریک",
        "ضد آفتاب",
        "آب پاک کننده",
        "پد پاک کننده آرایش",
        "پاک کننده صورت",
        "اکسسوری پاک کننده",
        "تونیک",
      ],
      general: [
        "اسکراب و لایه بردار صورت",
        "درمان روزانه",
        "درمان  شبانه",
        "سروم",
        "مراقبت چشم",
        "روشن کننده",
        "مرطوب کننده و آبرسان",
        "ضد تحریک",
        "ضد چین و چروک و اقزایش عمر",
        "مراقبت و درمان منافذ و بافت پوست",
        "هیالورنیک اسید",
      ],
    },
  };
  const careBrands = {
    Avene: "France",
    Clinique: "New York U.S.",
    "E.I.F": "California U.S.",
    Garnier: "France",
    "Kiko Milano": "Italy",
    "L'Oreal": "Paris",
    Ordinary: "Toronto Canada",
    Revolution: "U.K.",
    Sephora: "Paris France",
  };
  const brandTypes = ["ایرانی", "اورجینال", "های کپی"];
  const deliveryTypes = [
    "موجود در انبار",
    "یک الی هفت روز کاری",
    "هفت الی چهارده روز کاری",
  ];

  const sourceLink = "https://delmare.storage.iran.liara.space";
  const graphInfo = [
    {
      title: "شلوار",
      src: `${sourceLink}/sizegraph/sizegraphone.png`,
    },
    {
      title: "کاپشن",
      src: `${sourceLink}/sizegraph/sizegraphtwo.png`,
    },
    {
      title: "پیراهن",
      src: `${sourceLink}/sizegraph/sizegraphthree.png`,
    },
    {
      title: "بلوز",
      src: `${sourceLink}/sizegraph/sizegraphfour.png`,
    },
    {
      title: "بلوز شلوار",
      src: `${sourceLink}/sizegraph/sizegraphfive.png`,
    },
    {
      title: "کت شلوار",
      src: `${sourceLink}/sizegraph/sizegraphsix.png`,
    },
  ];

  const clothesSizeType = [
    {
      type: "FS",
      value: FS,
      clear: () => {
        setFS("");
        size["FS"] = {};
      },
      change: (value) => {
        setFS(value);
      },
    },
    {
      type: "XS",
      value: XS,
      clear: () => {
        setXS("");
        size["XS"] = {};
      },
      change: (value) => {
        setXS(value);
      },
    },
    {
      type: "S",
      value: S,
      clear: () => {
        setS("");
        size["S"] = {};
      },
      change: (value) => {
        setS(value);
      },
    },
    {
      type: "M",
      value: M,
      clear: () => {
        setM("");
        size["M"] = {};
      },
      change: (value) => {
        setM(value);
      },
    },
    {
      type: "L",
      value: L,
      clear: () => {
        setL("");
        size["L"] = {};
      },
      change: (value) => {
        setL(value);
      },
    },
    {
      type: "XL",
      value: XL,
      clear: () => {
        setXL("");
        size["XL"] = {};
      },
      change: (value) => {
        setXL(value);
      },
    },
  ];

  const shoesSizeType = [
    {
      type: "34",
      value: size34,
      clear: () => {
        setSize34("");
        size["34"] = {};
      },
      change: (value) => {
        setSize34(value);
      },
    },
    {
      type: "35",
      value: size35,
      clear: () => {
        setSize35("");
        size["35"] = {};
      },
      change: (value) => {
        setSize35(value);
      },
    },
    {
      type: "36",
      value: size36,
      clear: () => {
        setSize36("");
        size["36"] = {};
      },
      change: (value) => {
        setSize36(value);
      },
    },
    {
      type: "37",
      value: size37,
      clear: () => {
        setSize37("");
        size["37"] = {};
      },
      change: (value) => {
        setSize37(value);
      },
    },
    {
      type: "38",
      value: size38,
      clear: () => {
        setSize38("");
        size["38"] = {};
      },
      change: (value) => {
        setSize38(value);
      },
    },
    {
      type: "39",
      value: size39,
      clear: () => {
        setSize39("");
        size["39"] = {};
      },
      change: (value) => {
        setSize39(value);
      },
    },
    {
      type: "40",
      value: size40,
      clear: () => {
        setSize40("");
        size["40"] = {};
      },
      change: (value) => {
        setSize40(value);
      },
    },
    {
      type: "41",
      value: size41,
      clear: () => {
        setSize41("");
        size["41"] = {};
      },
      change: (value) => {
        setSize41(value);
      },
    },
    {
      type: "42",
      value: size42,
      clear: () => {
        setSize42("");
        size["42"] = {};
      },
      change: (value) => {
        setSize42(value);
      },
    },
    {
      type: "43",
      value: size43,
      clear: () => {
        setSize43("");
        size["43"] = {};
      },
      change: (value) => {
        setSize43(value);
      },
    },
    {
      type: "44",
      value: size44,
      clear: () => {
        setSize44("");
        size["44"] = {};
      },
      change: (value) => {
        setSize44(value);
      },
    },
    {
      type: "45",
      value: size45,
      clear: () => {
        setSize45("");
        size["45"] = {};
      },
      change: (value) => {
        setSize45(value);
      },
    },
  ];

  useEffect(() => {
    if (
      !JSON.parse(secureLocalStorage.getItem("currentUser")) ||
      JSON.parse(secureLocalStorage.getItem("currentUser"))["permission"] ===
        "admin" ||
      JSON.parse(secureLocalStorage.getItem("currentUser"))["permission"] ===
        "agent"
    ) {
      setContainer(false);
      setDisplayPage(true);
      setNavigationBottom(false);
    } else {
      Router.push("/");
    }
  }, [setContainer, setNavigationBottom]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getBrandsApi();
      setClothesBrands(data);
    };
    fetchData().catch(console.error);
  }, [setClothesBrands]);

  const transformDataSize = (value, type) => {
    let split = value.split(",");
    let items = split.map((item) => {
      return item.trim();
    });
    items.forEach((item) => {
      if (item != "")
        size[type]["colors"][item.split(" ")[0]] = Number(item.split(" ")[1]);
    });
  };

  const handleCareUpload = async () => {
    const validateFields = [
      title,
      description,
      price,
      brand,
      category,
      careType,
      careSize,
      careCountry,
      careCount,
      brandType,
      deliveryType,
    ];

    if (validateFields.some((field) => !field)) {
      setAlert("Fill in all fields");
      setTimeout(() => {
        setAlert("");
      }, 3000);
      return;
    }

    setUploadClicked(true);

    let delmareIdFolder = `CARE${sixGenerator()}`;

    if (mainImage !== "") {
      let imageId = `img${sixGenerator()}`;
      images.main = `${sourceLink}/${delmareIdFolder}/${imageId}.jpg`;
      await uploadImages(mainImage, imageId, delmareIdFolder);
    }
    if (imageOne !== "") {
      let imageId = `img${sixGenerator()}`;
      images.one = `${sourceLink}/${delmareIdFolder}/${imageId}.jpg`;
      await uploadImages(imageOne, imageId, delmareIdFolder);
    }
    if (imageTwo !== "") {
      let imageId = `img${sixGenerator()}`;
      images.two = `${sourceLink}/${delmareIdFolder}/${imageId}.jpg`;
      await uploadImages(imageTwo, imageId, delmareIdFolder);
    }
    if (imageThree !== "") {
      let imageId = `img${sixGenerator()}`;
      images.three = `${sourceLink}/${delmareIdFolder}/${imageId}.jpg`;
      await uploadImages(imageThree, imageId, delmareIdFolder);
    }

    const upload = await fetch(`/api/care`, {
      method: "POST",
      body: JSON.stringify({
        delmareId: delmareIdFolder,
        title: title.trim(),
        description: description.trim(),
        images: images,
        size: careSize,
        category: category,
        type: careType,
        count: parseInt(careCount),
        brand: brand,
        country: careCountry.trim(),
        brandType: brandType,
        deliveryType: deliveryType,
        price: price.trim(),
        discount: price - calculatePercentage(percentage, price),
        percentage: percentage.trim(),
        sale: sale,
        activate: true,
        display: true,
        views: Math.floor(Math.random() * 10) + 1,
        group: "care",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    checkUpload(upload);
  };

  const handleClothesUpload = async () => {
    const validateFields = [
      title,
      description,
      price,
      delmareId,
      brand,
      category,
      season,
      brandType,
      deliveryType,
    ];

    if (validateFields.some((field) => !field)) {
      setAlert("Fill in all fields");
      setTimeout(() => {
        setAlert("");
      }, 3000);
      return;
    }

    setUploadClicked(true);

    const sizeTransforms = {
      clothesSize: [
        { sizeData: FS, label: "FS" },
        { sizeData: XS, label: "XS" },
        { sizeData: S, label: "S" },
        { sizeData: M, label: "M" },
        { sizeData: L, label: "L" },
        { sizeData: XL, label: "XL" },
      ],
      shoesSize: [
        { sizeData: size34, label: "34" },
        { sizeData: size35, label: "35" },
        { sizeData: size36, label: "36" },
        { sizeData: size37, label: "37" },
        { sizeData: size38, label: "38" },
        { sizeData: size39, label: "39" },
        { sizeData: size40, label: "40" },
        { sizeData: size41, label: "41" },
        { sizeData: size42, label: "42" },
        { sizeData: size43, label: "43" },
        { sizeData: size44, label: "44" },
        { sizeData: size45, label: "45" },
      ],
    };
    const selectedSizeTransform = sizeTransforms[categorySize];
    selectedSizeTransform.forEach(({ sizeData, label }) => {
      transformDataSize(sizeData, label);
    });

    let delmareIdFolder = `${delmareId}${sixGenerator()}`;

    if (mainImage !== "") {
      let imageId = `img${sixGenerator()}`;
      images.main = `${sourceLink}/${delmareIdFolder}/${imageId}.jpg`;
      await uploadImages(mainImage, imageId, delmareIdFolder);
    }
    if (imageOne !== "") {
      let imageId = `img${sixGenerator()}`;
      images.one = `${sourceLink}/${delmareIdFolder}/${imageId}.jpg`;
      await uploadImages(imageOne, imageId, delmareIdFolder);
    }
    if (imageTwo !== "") {
      let imageId = `img${sixGenerator()}`;
      images.two = `${sourceLink}/${delmareIdFolder}/${imageId}.jpg`;
      await uploadImages(imageTwo, imageId, delmareIdFolder);
    }
    if (imageThree !== "") {
      let imageId = `img${sixGenerator()}`;
      images.three = `${sourceLink}/${delmareIdFolder}/${imageId}.jpg`;
      await uploadImages(imageThree, imageId, delmareIdFolder);
    }
    if (table !== "") {
      let imageId = `img${sixGenerator()}`;
      images.table = `${sourceLink}/${delmareIdFolder}/${imageId}.jpg`;
      images.graph = sizeGraph;
      await uploadImages(table, imageId, delmareIdFolder);
    }

    const upload = await fetch(`/api/product`, {
      method: "POST",
      body: JSON.stringify({
        delmareId: delmareIdFolder,
        title: title.trim(),
        description: description.trim(),
        images: images,
        size: size,
        category: category,
        season: season,
        brand: brand,
        brandType: brandType,
        deliveryType: deliveryType,
        price: price.trim(),
        discount: price - calculatePercentage(percentage, price),
        percentage: percentage.trim(),
        sale: sale,
        activate: true,
        display: true,
        views: Math.floor(Math.random() * 10) + 1,
        group: "clothing",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    checkUpload(upload);
  };

  const checkUpload = async (upload) => {
    if (upload.ok) {
      if (productCategory === "clothing") {
        // save product ID to its brand collection
        const product = await upload.json();
        selectedBrand.products.push(product["_id"]);
        await updateBrandApi(selectedBrand);
      }
      setAlert("Product saved successfully");
    } else {
      setAlert("Data save failed, try again");
    }
    setTimeout(() => {
      Router.reload(window.location.pathname);
    }, 1000);
  };

  // upload images into s3 bucket
  const uploadImages = async (image, imageId, delmareIdFolder) => {
    const file = image;
    const res = await fetch(
      `/api/image?file=${delmareIdFolder}/${imageId}.jpg`
    );
    const { url, fields } = await res.json();

    const formData = new FormData();
    Object.entries({ ...fields, file }).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const upload = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const alertMessage = upload.ok
      ? "Images uploaded successfully"
      : "Images upload failed";
    setAlert(alertMessage);
    setTimeout(() => {
      setAlert("");
    }, 1000);
  };

  const assignBrand = (value) => {
    switch (productCategory) {
      case "clothing":
        const selectedBrand = clothesBrands.find(
          (brand) => brand.title === value
        );
        if (selectedBrand) {
          setBrand(value);
          setDelmareId(selectedBrand.delmareId);
          setSelectedBrand(selectedBrand);
        }
        break;
      case "care":
        setBrand(value);
        setCareCountry(careBrands[value]);
        break;
    }
  };

  const resetSizes = () => {
    setFS("");
    setXS("");
    setS("");
    setM("");
    setL("");
    setXL("");
    setSize34("");
    setSize35("");
    setSize36("");
    setSize37("");
    setSize38("");
    setSize39("");
    setSize40("");
    setSize41("");
    setSize42("");
    setSize43("");
    setSize44("");
    setSize45("");
  };

  return (
    <Fragment>
      {displayPage && (
        <Fragment>
          <Head>
            <title>Upload</title>
            <meta name="description" content="Upload a new product" />
          </Head>
          <div className="navigationBar">
            <ArrowBackIosNewIcon
              className="icon"
              onClick={() => Router.push("/")}
              sx={{ fontSize: 30 }}
            />
            <h3>اطلاعات آیتم</h3>
            <RefreshIcon
              className="icon"
              onClick={() => Router.reload(window.location.pathname)}
              sx={{ fontSize: 30 }}
            />
          </div>
          <div className={classes.typeToggle}>
            <button
              className="mainButton"
              onClick={() => {
                setProductCategory("clothing");
              }}
            >
              Clothing
            </button>
            <h4>{productCategory === "clothing" ? "Clothing" : "Care"}</h4>
            <button
              className="mainButton"
              onClick={() => {
                setProductCategory("care");
              }}
            >
              Care
            </button>
          </div>
          <div className="upload-form">
            <div className={classes.input}>
              <div className={classes.bar}>
                <CloseIcon
                  className="icon"
                  onClick={() => setTitle("")}
                  sx={{ fontSize: 16 }}
                />
                <p className={classes.label}>اسم آیتم</p>
              </div>
              <input
                type="text"
                id="title"
                name="title"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                autoComplete="off"
                dir="rtl"
                maxLength="20"
              />
            </div>
            {productCategory === "clothing" ? (
              <Fragment>
                <div className={classes.input}>
                  <select
                    defaultValue={"default"}
                    onChange={(e) => assignBrand(e.target.value)}
                  >
                    <option value="default" disabled>
                      برند
                    </option>
                    {clothesBrands.map((brand, index) => {
                      return (
                        <option key={index} value={brand.title}>
                          {brand.title}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className={classes.input}>
                  <div className={classes.bar}>
                    <CloseIcon
                      className="icon"
                      onClick={() => setDelmareId("")}
                      sx={{ fontSize: 16 }}
                    />
                    <p className={classes.label}>کد برند</p>
                  </div>
                  <input
                    type="text"
                    id="delmareId"
                    name="delmareId"
                    onChange={(e) => setDelmareId(e.target.value)}
                    value={delmareId}
                    autoComplete="off"
                  />
                </div>
                <div className={classes.input}>
                  <select
                    defaultValue={"default"}
                    onChange={(e) => setBrandType(e.target.value)}
                  >
                    <option value="default" disabled>
                      نوع
                    </option>
                    {brandTypes.map((brand, index) => {
                      return (
                        <option key={index} value={brand}>
                          {brand}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </Fragment>
            ) : (
              <Fragment>
                <div className={classes.input}>
                  <select
                    defaultValue={"default"}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="default" disabled>
                      دسته
                    </option>
                    {careCategories.map((category, index) => {
                      return (
                        <option key={index} value={category}>
                          {category}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className={classes.input}>
                  <select
                    defaultValue={"default"}
                    onChange={(e) => setCareType(e.target.value)}
                  >
                    <option value="default" disabled>
                      گروه
                    </option>
                    {careTypes[category]?.["group"].map((type, index) => {
                      return (
                        <option key={index} value={type}>
                          {type}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className={classes.input}>
                  <select
                    defaultValue={"default"}
                    onChange={(e) => setBrandType(e.target.value)}
                  >
                    <option value="default" disabled>
                      نوع
                    </option>
                    {careTypes[category]?.["general"].map((type, index) => {
                      return (
                        <option key={index} value={type}>
                          {type}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className={classes.input}>
                  <select
                    defaultValue={"default"}
                    onChange={(e) => assignBrand(e.target.value)}
                  >
                    <option value="default" disabled>
                      برند
                    </option>
                    {Object.keys(careBrands).map((brand, index) => {
                      return (
                        <option key={index} value={brand}>
                          {brand}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className={classes.input}>
                  <div className={classes.bar}>
                    <CloseIcon
                      className="icon"
                      onClick={() => setCareCountry("")}
                      sx={{ fontSize: 16 }}
                    />
                    <p className={classes.label}>کشور</p>
                  </div>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    onChange={(e) => setCareCountry(e.target.value)}
                    value={careCountry}
                    autoComplete="off"
                  />
                </div>
                <div className={classes.input}>
                  <div className={classes.bar}>
                    <CloseIcon
                      className="icon"
                      onClick={() => setCareSize("")}
                      sx={{ fontSize: 16 }}
                    />
                    <p className={classes.label}>اندازه</p>
                  </div>
                  <input
                    type="tel"
                    id="size"
                    name="size"
                    onChange={(e) => setCareSize(e.target.value)}
                    value={careSize}
                    autoComplete="off"
                    placeholder="120"
                  />
                </div>
                <div className={classes.input}>
                  <div className={classes.bar}>
                    <CloseIcon
                      className="icon"
                      onClick={() => setCareCount("")}
                      sx={{ fontSize: 16 }}
                    />
                    <p className={classes.label}>تعداد</p>
                  </div>
                  <input
                    type="tel"
                    id="count"
                    name="count"
                    onChange={(e) => setCareCount(e.target.value)}
                    value={careCount}
                    autoComplete="off"
                    placeholder="4"
                  />
                </div>
              </Fragment>
            )}
            <div className={classes.input}>
              <select
                defaultValue={"default"}
                onChange={(e) => setDeliveryType(e.target.value)}
              >
                <option value="default" disabled>
                  تحویل
                </option>
                {deliveryTypes.map((delivery, index) => {
                  return (
                    <option key={index} value={delivery}>
                      {delivery}
                    </option>
                  );
                })}
              </select>
            </div>
            {productCategory === "clothing" && (
              <Fragment>
                <div className={classes.input}>
                  <select
                    defaultValue={"default"}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="default" disabled>
                      دسته
                    </option>
                    {generalCategories.map((category, index) => {
                      return (
                        <option key={index} value={category}>
                          {category}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className={classes.input}>
                  <select
                    defaultValue={"default"}
                    onChange={(e) => setSeason(e.target.value)}
                  >
                    <option value="default" disabled>
                      فصل
                    </option>
                    {seasons.map((season, index) => {
                      return (
                        <option key={index} value={season}>
                          {season}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </Fragment>
            )}
            <div className={classes.input}>
              <div className={classes.bar}>
                <CloseIcon
                  className="icon"
                  onClick={() => setDescription("")}
                  sx={{ fontSize: 16 }}
                />
                <p className={classes.label}>توضیحات</p>
              </div>
              <textarea
                type="text"
                id="description"
                name="description"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                autoComplete="off"
                dir="rtl"
                maxLength="250"
              ></textarea>
            </div>
            <div className={classes.input}>
              <div className={classes.bar}>
                <CloseIcon
                  className="icon"
                  onClick={() => setPrice("")}
                  sx={{ fontSize: 16 }}
                />
                <LocalOfferIcon
                  className="icon"
                  onClick={() => setSale(!sale)}
                  sx={{ color: "#d40d12", fontSize: 22 }}
                />
                <p>{convertNumber(Number(price))} T</p>
                <p className={classes.label}>قیمت تومان</p>
              </div>
              <input
                type="tel"
                id="price"
                name="price"
                onChange={(e) => setPrice(e.target.value)}
                value={price}
                autoComplete="off"
              />
            </div>
            {sale && (
              <Fragment>
                <div className={classes.input}>
                  <div className={classes.bar}>
                    <CloseIcon
                      className="icon"
                      onClick={() => setPercentage("")}
                      sx={{ fontSize: 16 }}
                    />
                    <p className={classes.label}>درصد تخفیف</p>
                  </div>
                  <input
                    type="tel"
                    id="percentage"
                    name="percentage"
                    onChange={(e) => setPercentage(e.target.value)}
                    value={percentage}
                    autoComplete="off"
                  />
                </div>
              </Fragment>
            )}
            {productCategory === "clothing" && (
              <Fragment>
                <h3>سایز رنگ تعداد</h3>
                <div className={classes.typeToggle}>
                  <button
                    className="mainButton"
                    onClick={() => {
                      setCategorySize("clothesSize");
                    }}
                  >
                    Clothing
                  </button>
                  <button
                    className="mainButton"
                    onClick={() => {
                      setCategorySize("shoesSize");
                      resetSizes();
                    }}
                  >
                    Shoes
                  </button>
                </div>
                {categorySize === "clothesSize" && (
                  <div className={classes.sizeContainer}>
                    {clothesSizeType.map((size, index) => (
                      <div className={classes.input} key={index}>
                        <div className={classes.bar}>
                          <p className={classes.label}>{size.type}</p>
                          <CloseIcon
                            className="icon"
                            onClick={size.clear}
                            sx={{ fontSize: 16 }}
                          />
                        </div>
                        <input
                          placeholder="b21c1c 5, 514242 9"
                          className={classes.size}
                          type="text"
                          id={size.type}
                          name={size.type}
                          onChange={(e) => size.change(e.target.value)}
                          value={size.value}
                          autoComplete="off"
                        />
                      </div>
                    ))}
                  </div>
                )}
                {categorySize === "shoesSize" && (
                  <div className={classes.sizeContainer}>
                    {shoesSizeType.map((size, index) => (
                      <div className={classes.input} key={index}>
                        <div className={classes.bar}>
                          <p className={classes.label}>{size.type}</p>
                          <CloseIcon
                            className="icon"
                            onClick={size.clear}
                            sx={{ fontSize: 16 }}
                          />
                        </div>
                        <input
                          placeholder="b21c1c 5, 514242 9"
                          className={classes.size}
                          type="text"
                          id={size.type}
                          name={size.type}
                          onChange={(e) => size.change(e.target.value)}
                          value={size.value}
                          autoComplete="off"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </Fragment>
            )}
            <h3>انتخاب عکس</h3>
            <div className="input">
              <div>
                <p className={classes.label}>Main</p>
                <input
                  onChange={(e) => {
                    setMainImage(e.target.files[0]);
                  }}
                  type="file"
                  accept="image/png, image/jpeg"
                />
              </div>
              {mainImage !== "" && (
                <Image
                  className={classes.image}
                  width={50}
                  height={70}
                  objectFit="cover"
                  src={URL.createObjectURL(mainImage)}
                  alt="mainImage"
                />
              )}
            </div>
            <div className="input">
              <div>
                <p className={classes.label}>Image 1</p>
                <input
                  onChange={(e) => {
                    setImageOne(e.target.files[0]);
                  }}
                  type="file"
                  accept="image/png, image/jpeg"
                />
              </div>
              {imageOne !== "" && (
                <Image
                  className={classes.image}
                  width={50}
                  height={70}
                  objectFit="cover"
                  src={URL.createObjectURL(imageOne)}
                  alt="image"
                />
              )}
            </div>
            <div className="input">
              <div>
                <p className={classes.label}>Image 2</p>
                <input
                  onChange={(e) => {
                    setImageTwo(e.target.files[0]);
                  }}
                  type="file"
                  accept="image/png, image/jpeg"
                />
              </div>
              {imageTwo !== "" && (
                <Image
                  className={classes.image}
                  width={50}
                  height={70}
                  objectFit="cover"
                  src={URL.createObjectURL(imageTwo)}
                  alt="image"
                />
              )}
            </div>
            <div className="input">
              <div>
                <p className={classes.label}>Image 3</p>
                <input
                  onChange={(e) => {
                    setImageThree(e.target.files[0]);
                  }}
                  type="file"
                  accept="image/png, image/jpeg"
                />
              </div>
              {imageThree !== "" && (
                <Image
                  className={classes.image}
                  width={50}
                  height={70}
                  objectFit="cover"
                  src={URL.createObjectURL(imageThree)}
                  alt="image"
                />
              )}
            </div>
            {productCategory === "clothing" && (
              <Fragment>
                <div className="input">
                  <div>
                    <p className={classes.label}>Size table</p>
                    <input
                      onChange={(e) => {
                        setTable(e.target.files[0]);
                      }}
                      type="file"
                      accept="image/png, image/jpeg"
                    />
                  </div>
                  {table !== "" && (
                    <Image
                      width={150}
                      height={70}
                      objectFit="cover"
                      src={URL.createObjectURL(table)}
                      alt="image"
                    />
                  )}
                </div>
                {table !== "" && (
                  <Fragment>
                    <div className={classes.sizeGraphContainer}>
                      {graphInfo.map((info, index) => (
                        <div
                          className={classes.graph}
                          key={index}
                          onClick={() => setSizeGraph(info.src)}
                        >
                          <Image
                            src={info.src}
                            alt="graph"
                            objectFit="contain"
                            width={50}
                            height={50}
                          />
                          <p>{info.title}</p>
                        </div>
                      ))}
                    </div>
                    {sizeGraph !== "" && (
                      <div className={classes.sizeGraph}>
                        <Image
                          src={sizeGraph}
                          alt="graph"
                          objectFit="contain"
                          width={80}
                          height={80}
                        />
                        <CloseIcon
                          className="icon"
                          onClick={() => setSizeGraph("")}
                          sx={{ fontSize: 16 }}
                        />
                      </div>
                    )}
                  </Fragment>
                )}
              </Fragment>
            )}
            <p className={classes.alert}>{alert}</p>
            {uploadClicked && (
              <Image
                width={50}
                height={50}
                src={loadingImage}
                alt="isLoading"
              />
            )}
            <button
              className="mainButton"
              onClick={() =>
                productCategory === "clothing"
                  ? handleClothesUpload()
                  : handleCareUpload()
              }
              disabled={uploadClicked}
            >
              Upload
            </button>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
}

// initial connection to db
export async function getServerSideProps(context) {
  try {
    await dbConnect();
    return {
      props: {},
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
