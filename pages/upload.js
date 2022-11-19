import { useContext, useEffect, useState } from "react";
import { StateContext } from "../context/stateContext";
import Image from "next/image";
import CloseIcon from "@mui/icons-material/Close";
import classes from "./page.module.scss";
import { tokenGenerator } from "../services/utility";
import loadingImage from "../assets/loader.png";
import Router from "next/router";
import dbConnect from "../services/dbConnect";

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
  };

  const { container, setContainer } = useContext(StateContext);
  const { currentUser, seCurrentUser } = useContext(StateContext);
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
  const [delmareId, setDelmareId] = useState("");
  const [designer, setDesigner] = useState("");

  const [size, setSize] = useState(sizeInitialState);
  const [images, setImages] = useState(imageInitialState);

  useEffect(() => {
    if (
      !JSON.parse(localStorage.getItem("currentUser")) ||
      JSON.parse(localStorage.getItem("currentUser"))["permission"] ===
        "customer"
    ) {
      Router.push("/");
      return;
    } else {
      setContainer(false);
    }
  }, [setContainer]);

  const transformDataSize = (value, type) => {
    console.log(value);

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
    if (!title && !description && !price && !delmareId && !designer) {
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
      await uploadImages(table, imageId, delmareIdFolder);
    }

    // upload product data into db
    const upload = await fetch(`/api/product`, {
      method: "POST",
      body: JSON.stringify({
        title: title.trim(),
        description: description.trim(),
        price: price.trim(),
        designer: designer.trim(),
        delmareId: delmareIdFolder,
        images: images,
        size: size,
        views: Math.floor(Math.random() * 10) + 1,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (upload.ok) {
      setAlert(delmareIdFolder);
    } else {
      setAlert("Data save failed, try again");
    }

    setTimeout(() => {
      Router.reload(window.location.pathname);
    }, 30000);
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

  return (
    <div className="upload-form">
      <h3>Product information</h3>
      <div className={classes.input}>
        <div className={classes.bar}>
          <p className={classes.label}>Title</p>
          <CloseIcon
            className="icon"
            onClick={() => setTitle("")}
            sx={{ fontSize: 16 }}
          />
        </div>
        <input
          type="text"
          id="title"
          name="title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          autoComplete="off"
          dir="rtl"
        />
      </div>
      <div className={classes.input}>
        <div className={classes.bar}>
          <p className={classes.label}>Designer</p>
          <CloseIcon
            className="icon"
            onClick={() => setDesigner("")}
            sx={{ fontSize: 16 }}
          />
        </div>
        <input
          type="text"
          id="designer"
          name="designer"
          onChange={(e) => setDesigner(e.target.value)}
          value={designer}
          autoComplete="off"
        />
      </div>
      <div className={classes.input}>
        <div className={classes.bar}>
          <p className={classes.label}>Price Toman</p>
          <CloseIcon
            className="icon"
            onClick={() => setPrice("")}
            sx={{ fontSize: 16 }}
          />
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
      <div className={classes.input}>
        <div className={classes.bar}>
          <p className={classes.label}>Delmare Id</p>
          <CloseIcon
            className="icon"
            onClick={() => setDelmareId("")}
            sx={{ fontSize: 16 }}
          />
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
        <div className={classes.bar}>
          <p className={classes.label}>Description</p>
          <CloseIcon
            className="icon"
            onClick={() => setDescription("")}
            sx={{ fontSize: 16 }}
          />
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

      <h3>Size, color, count</h3>
      <div className={classes.sizeNav}>
        {freeSize ? (
          <p onClick={() => setFreeSize(false)}>Add size</p>
        ) : (
          <p onClick={() => setFreeSize(true)}>Free size</p>
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
              type="tel"
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
              type="tel"
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
              type="tel"
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
              type="tel"
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
              type="tel"
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
              type="tel"
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
              type="tel"
              id="XXL"
              name="XXL"
              onChange={(e) => setXXL(e.target.value)}
              value={XXL}
              autoComplete="off"
            />
          </div>
        </div>
      )}

      <h3>Upload images</h3>
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
