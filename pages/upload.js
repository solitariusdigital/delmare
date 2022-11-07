import { useContext, useEffect, useState } from "react";
import { StateContext } from "../context/stateContext";
import Image from "next/image";
import CloseIcon from "@mui/icons-material/Close";
import classes from "./upload.module.scss";
import { tokenGenerator } from "../services/utility";
import loadingImage from "../assets/loader.png";
import Router from "next/router";
import dbConnect from "../services/dbConnect";

function Upload() {
  const sizeInitialState = {
    XS: {},
    S: {},
    M: {},
    L: {},
    XL: {},
    XXL: {},
  };
  const imageInitialState = {
    main: "",
    one: "",
    two: "",
    three: "",
    table: "",
  };

  const { container, setContainer } = useContext(StateContext);
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

  // data to save into db
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [size, setSize] = useState(sizeInitialState);
  const [images, setImages] = useState(imageInitialState);

  useEffect(() => {
    setContainer(false);
  }, [setContainer]);

  const transformDataSize = (value, type) => {
    let split = value.split(",");
    let items = split.map((item) => {
      return item.trim();
    });
    items.forEach((item) => {
      if (item != "") size[type][item.split(" ")[0]] = item.split(" ")[1];
    });
  };

  const handleUpload = async () => {
    if (!title && !description && !price) {
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
    transformDataSize(XXL, "XXL");

    if (mainImage !== "") {
      let imageId = `img${tokenGenerator()}`;
      images.main = `https://delmare.storage.iran.liara.space/${imageId}.jpg`;
      await uploadImages(mainImage, imageId);
    }
    if (imageOne !== "") {
      let imageId = `img${tokenGenerator()}`;
      images.one = `https://delmare.storage.iran.liara.space/${imageId}.jpg`;
      await uploadImages(imageOne, imageId);
    }
    if (imageTwo !== "") {
      let imageId = `img${tokenGenerator()}`;
      images.two = `https://delmare.storage.iran.liara.space/${imageId}.jpg`;
      await uploadImages(imageTwo, imageId);
    }
    if (imageThree !== "") {
      let imageId = `img${tokenGenerator()}`;
      images.three = `https://delmare.storage.iran.liara.space/${imageId}.jpg`;
      await uploadImages(imageThree, imageId);
    }
    if (table !== "") {
      let imageId = `img${tokenGenerator()}`;
      images.table = `https://delmare.storage.iran.liara.space/${imageId}.jpg`;
      await uploadImages(table, imageId);
    }

    // upload product data into db
    const upload = await fetch(`/api/product`, {
      method: "POST",
      body: JSON.stringify({
        title: title,
        description: description,
        price: price,
        images: images,
        size: size,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (upload.ok) {
      setAlert("Data saved successfully");
      // reset all variables/data after upload into db
      setTitle("");
      setDescription("");
      setPrice("");
      setImages(imageInitialState);
      setSize(sizeInitialState);
      setMainImage("");
      setImageOne("");
      setImageTwo("");
      setImageThree("");
      setTable("");
      setXS("");
      setS("");
      setM("");
      setL("");
      setXL("");
      setXXL("");
    } else {
      setAlert("Data save failed, try again");
    }

    setTimeout(() => {
      setAlert("");
      setUploadClicked(false);
      Router.push("/upload");
    }, 3000);
  };

  // upload images into s3 bucket
  const uploadImages = async (image, imageId) => {
    const file = image;
    const res = await fetch(`/api/image?file=${imageId}.jpg`);
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
            width={50}
            height={70}
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
            width={50}
            height={70}
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
            width={50}
            height={70}
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
            width={50}
            height={70}
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

export default Upload;
