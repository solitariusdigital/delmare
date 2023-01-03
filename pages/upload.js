import { Fragment, useContext, useEffect, useState } from "react";
import { StateContext } from "../context/stateContext";
import Image from "next/image";
import CloseIcon from "@mui/icons-material/Close";
import classes from "./page.module.scss";
import { tokenGenerator } from "../services/utility";
import loadingImage from "../assets/loader.png";
import Router from "next/router";
import dbConnect from "../services/dbConnect";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import RefreshIcon from "@mui/icons-material/Refresh";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { getBrandsApi, updateBrandApi } from "../services/api";
import Head from "next/head";
import secureLocalStorage from "react-secure-storage";

export default function Upload() {
  const sizeInitialState = {
    XS: { colors: {} },
    S: { colors: {} },
    M: { colors: {} },
    L: { colors: {} },
    XL: { colors: {} },
    XXL: { colors: {} },
    FS: { colors: {} },
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

  const [uploadClicked, setUploadClicked] = useState(false);
  const [alert, setAlert] = useState("");

  const [mainImage, setMainImage] = useState("");
  const [imageOne, setImageOne] = useState("");
  const [imageTwo, setImageTwo] = useState("");
  const [imageThree, setImageThree] = useState("");
  const [table, setTable] = useState("");

  const [XS, setXS] = useState("");
  const [S, setS] = useState("");
  const [M, setM] = useState("");
  const [L, setL] = useState("");
  const [XL, setXL] = useState("");
  const [XXL, setXXL] = useState("");
  const [FS, setFS] = useState("");
  const [freeSize, setFreeSize] = useState(false);

  // data to save into db
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
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
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [sizeGraph, setSizeGraph] = useState("");

  const brandTypes = ["ایرانی", "اورجینال", "های کپی"];
  const deliveryTypes = [
    "موجود در انبار",
    "یک الی هفت روز کاری",
    "هفت الی چهارده روز کاری",
  ];

  const graphInfo = [
    {
      title: "شلوار",
      src: "https://delmare.storage.iran.liara.space/sizegraph/sizegraphone.png",
    },
    {
      title: "کاپشن",
      src: "https://delmare.storage.iran.liara.space/sizegraph/sizegraphtwo.png",
    },
    {
      title: "پیراهن",
      src: "https://delmare.storage.iran.liara.space/sizegraph/sizegraphthree.png",
    },
    {
      title: "بلوز",
      src: "https://delmare.storage.iran.liara.space/sizegraph/sizegraphfour.png",
    },
    {
      title: "بلوز شلوار",
      src: "https://delmare.storage.iran.liara.space/sizegraph/sizegraphfive.png",
    },
    {
      title: "کت شلوار",
      src: "https://delmare.storage.iran.liara.space/sizegraph/sizegraphsix.png",
    },
  ];

  useEffect(() => {
    if (
      !JSON.parse(secureLocalStorage.getItem("currentUser")) ||
      JSON.parse(secureLocalStorage.getItem("currentUser"))["permission"] ===
        "customer"
    ) {
      Router.push("/");
      return;
    } else {
      setContainer(false);
    }
  }, [setContainer]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getBrandsApi();
      setBrands(data);
    };
    fetchData().catch(console.error);
  }, [setBrands]);

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

  const handleUpload = async () => {
    if (
      !title ||
      !description ||
      !price ||
      !delmareId ||
      !brand ||
      !category ||
      !season ||
      !brandType ||
      !deliveryType
    ) {
      setAlert("Fill in all fields");
      setTimeout(() => {
        setAlert("");
      }, 3000);
      return;
    }

    setUploadClicked(true);

    transformDataSize(XS, "XS");
    transformDataSize(S, "S");
    transformDataSize(M, "M");
    transformDataSize(L, "L");
    transformDataSize(XL, "XL");
    transformDataSize(FS, "FS");

    let delmareIdFolder = `${delmareId}${tokenGenerator()}`;

    if (mainImage !== "") {
      let imageId = `img${tokenGenerator()}`;
      images.main = `https://delmare.storage.iran.liara.space/${delmareIdFolder}/${imageId}.jpg`;
      await uploadImages(mainImage, imageId, delmareIdFolder);
    }
    if (imageOne !== "") {
      let imageId = `img${tokenGenerator()}`;
      images.one = `https://delmare.storage.iran.liara.space/${delmareIdFolder}/${imageId}.jpg`;
      await uploadImages(imageOne, imageId, delmareIdFolder);
    }
    if (imageTwo !== "") {
      let imageId = `img${tokenGenerator()}`;
      images.two = `https://delmare.storage.iran.liara.space/${delmareIdFolder}/${imageId}.jpg`;
      await uploadImages(imageTwo, imageId, delmareIdFolder);
    }
    if (imageThree !== "") {
      let imageId = `img${tokenGenerator()}`;
      images.three = `https://delmare.storage.iran.liara.space/${delmareIdFolder}/${imageId}.jpg`;
      await uploadImages(imageThree, imageId, delmareIdFolder);
    }
    if (table !== "") {
      let imageId = `img${tokenGenerator()}`;
      images.table = `https://delmare.storage.iran.liara.space/${delmareIdFolder}/${imageId}.jpg`;
      images.graph = sizeGraph;
      await uploadImages(table, imageId, delmareIdFolder);
    }

    // upload product data into db
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
        discount: discount.trim(),
        percentage: percentage.trim(),
        sale: sale,
        activate: true,
        views: Math.floor(Math.random() * 10) + 1,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (upload.ok) {
      // save product ID to its brand collection
      const product = await upload.json();
      selectedBrand.products.push(product["_id"]);
      await updateBrandApi(selectedBrand);
      setAlert("Product saved successfully");
    } else {
      setAlert("Data save failed, try again");
    }

    setTimeout(() => {
      Router.reload(window.location.pathname);
    }, 3000);
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

    if (upload.ok) {
      setAlert("Images uploaded successfully");
    } else {
      setAlert("Images upload failed");
    }
    setTimeout(() => {
      setAlert("");
    }, 1000);
  };

  const assignBrand = (value) => {
    setBrand(value);
    brands.forEach((brand) => {
      if (brand.title === value) {
        setDelmareId(brand.delmareId);
        setSelectedBrand(brand);
      }
    });
  };

  const resetSizes = () => {
    setFreeSize(true);
    setXS("");
    setS("");
    setM("");
    setL("");
    setXL("");
    setXXL("");
  };

  return (
    <Fragment>
      <Head>
        <title>Upload</title>
        <meta name="description" content="Upload a new product" />
      </Head>
      <div className="upload-form">
        <div className="bar">
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
            maxLength="12"
          />
        </div>
        <div className={classes.input}>
          <select
            defaultValue={"default"}
            onChange={(e) => assignBrand(e.target.value)}
          >
            <option value="default" disabled>
              برند
            </option>
            {brands.map((brand, index) => {
              return (
                <option key={index} value={brand.title}>
                  {brand.title}
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
              نوع برند
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
        <div className={classes.input}>
          <select
            defaultValue={"default"}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="default" disabled>
              دسته بندی
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
            <MonetizationOnIcon
              className="icon"
              onClick={() => setSale(!sale)}
              sx={{ color: "#d40d12", fontSize: 25 }}
            />
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
                  onClick={() => setDiscount("")}
                  sx={{ fontSize: 16 }}
                />
                <p className={classes.label}>قیمت تخفیف تومان</p>
              </div>
              <input
                type="tel"
                id="discount"
                name="discount"
                onChange={(e) => setDiscount(e.target.value)}
                value={discount}
                autoComplete="off"
              />
            </div>
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
        <h3>رنگ، سایز، تعداد</h3>
        <div className={classes.sizeNav}>
          {freeSize ? (
            <button
              className="mainButton"
              onClick={() => {
                setFreeSize(false);
                setFS("");
              }}
            >
              Add size
            </button>
          ) : (
            <button className="mainButton" onClick={() => resetSizes()}>
              Free size
            </button>
          )}
        </div>
        {freeSize && (
          <div className={classes.sizeContainer}>
            <div className={classes.input}>
              <div className={classes.bar}>
                <p className={classes.label}>Free Size - FS</p>
                <CloseIcon
                  className="icon"
                  onClick={() => {
                    setFS("");
                    size["FS"] = {};
                  }}
                  sx={{ fontSize: 16 }}
                />
              </div>
              <input
                placeholder="b21c1c 5, 514242 45"
                className={classes.size}
                type="text"
                id="FS"
                name="FS"
                onChange={(e) => setFS(e.target.value)}
                value={FS}
                autoComplete="off"
              />
            </div>
          </div>
        )}
        {!freeSize && (
          <div className={classes.sizeContainer}>
            <div className={classes.input}>
              <div className={classes.bar}>
                <p className={classes.label}>XS</p>
                <CloseIcon
                  className="icon"
                  onClick={() => {
                    setXS("");
                    size["XS"] = {};
                  }}
                  sx={{ fontSize: 16 }}
                />
              </div>
              <input
                placeholder="b21c1c 5, 514242 45"
                className={classes.size}
                type="text"
                id="XS"
                name="XS"
                onChange={(e) => setXS(e.target.value)}
                value={XS}
                autoComplete="off"
              />
            </div>
            <div className={classes.input}>
              <div className={classes.bar}>
                <p className={classes.label}>S</p>
                <CloseIcon
                  className="icon"
                  onClick={() => {
                    setS("");
                    size["S"] = {};
                  }}
                  sx={{ fontSize: 16 }}
                />
              </div>
              <input
                className={classes.size}
                type="text"
                id="S"
                name="S"
                onChange={(e) => setS(e.target.value)}
                value={S}
                autoComplete="off"
              />
            </div>
            <div className={classes.input}>
              <div className={classes.bar}>
                <p className={classes.label}>M</p>
                <CloseIcon
                  className="icon"
                  onClick={() => {
                    setM("");
                    size["M"] = {};
                  }}
                  sx={{ fontSize: 16 }}
                />
              </div>
              <input
                className={classes.size}
                type="text"
                id="M"
                name="M"
                onChange={(e) => setM(e.target.value)}
                value={M}
                autoComplete="off"
              />
            </div>
            <div className={classes.input}>
              <div className={classes.bar}>
                <p className={classes.label}>L</p>
                <CloseIcon
                  className="icon"
                  onClick={() => {
                    setL("");
                    size["L"] = {};
                  }}
                  sx={{ fontSize: 16 }}
                />
              </div>
              <input
                className={classes.size}
                type="text"
                id="L"
                name="L"
                onChange={(e) => setL(e.target.value)}
                value={L}
                autoComplete="off"
              />
            </div>
            <div className={classes.input}>
              <div className={classes.bar}>
                <p className={classes.label}>XL</p>
                <CloseIcon
                  className="icon"
                  onClick={() => {
                    setXL("");
                    size["XL"] = {};
                  }}
                  sx={{ fontSize: 16 }}
                />
              </div>
              <input
                className={classes.size}
                type="text"
                id="XL"
                name="XL"
                onChange={(e) => setXL(e.target.value)}
                value={XL}
                autoComplete="off"
              />
            </div>
            <div className={classes.input}>
              <div className={classes.bar}>
                <p className={classes.label}>XXL</p>
                <CloseIcon
                  className="icon"
                  onClick={() => {
                    setXXL("");
                    size["XXL"] = {};
                  }}
                  sx={{ fontSize: 16 }}
                />
              </div>
              <input
                className={classes.size}
                type="text"
                id="XXL"
                name="XXL"
                onChange={(e) => setXXL(e.target.value)}
                value={XXL}
                autoComplete="off"
              />
            </div>
          </div>
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
        <p className={classes.alert}>{alert}</p>
        {uploadClicked && (
          <Image width={50} height={50} src={loadingImage} alt="isLoading" />
        )}
        <button
          className="mainButton"
          onClick={() => handleUpload()}
          disabled={uploadClicked}
        >
          Upload
        </button>
      </div>
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
