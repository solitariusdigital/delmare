import { useEffect, useContext, useState } from "react";
import { StateContext } from "../../context/stateContext";
import Router from "next/router";
import {
  postMellatApi,
  createInvoiceApi,
  getProductApi,
  updateProductApi,
  getUserApi,
  updateUserApi,
} from "../../services/api";
import classes from "../page.module.scss";
import CancelIcon from "@mui/icons-material/Cancel";
import qs from "querystring";
import secureLocalStorage from "react-secure-storage";
import Image from "next/image";
import Kavenegar from "kavenegar";
import loadingImage from "../../assets/loader.png";

export default function Confirmation({ props }) {
  const { toggleContainer, setToggleContainer } = useContext(StateContext);
  const { shoppingCart, setShoppingCart } = useContext(StateContext);
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const { kavenegarKey, setKavenegarKey } = useContext(StateContext);

  const [displayReject, setDisplayReject] = useState(false);
  const [displayConfirmation, setDisplayConfirmation] = useState(false);
  const [refId, setRefId] = useState("");
  const [displayButton, setDisplayButton] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (props.ResCode === "0") {
        try {
          const check = await postMellatApi(props);
          if (check.code === 200) {
            setRefId(check.refId);
            await Promise.all(shoppingCart.map(updateProductData));
            setDisplayConfirmation(true);
            await updateUserDiscount();
            await clearShoppingCart();
            setDisplayButton(true);
          } else {
            setDisplayReject(true);
          }
        } catch (error) {
          console.error(error);
          setDisplayReject(true);
        }
      } else {
        setDisplayReject(true);
      }
    };

    const updateProductData = async (product) => {
      const invoice = createInvoiceObject(product);
      await createInvoiceApi(invoice);
      await updateProductCount(product);
    };

    const createInvoiceObject = (product) => {
      return {
        name: currentUser.name,
        phone: currentUser.phone,
        address: currentUser.address,
        post: currentUser.post,
        userId: currentUser["_id"],
        productId: product["_id"],
        delmareId: product.delmareId,
        refId: refId,
        title: product.title,
        price: product.price,
        color: product.color,
        size: product.size,
        image: product.image,
        deliveryType: product.deliveryType,
        bloggerDelmareId: product.bloggerDelmareId,
        posted: false,
      };
    };

    const updateProductCount = async (product) => {
      // get latest product and update count and save on db
      let getProduct = await getProductApi(product["_id"]);
      if (getProduct.size[product.size].colors[product.color] > 0) {
        getProduct.size[product.size].colors[product.color]--;
        if (
          Object.keys(getProduct.size).length === 1 &&
          Object.keys(getProduct.size[product.size].colors).length === 1 &&
          getProduct.size[product.size].colors[product.color] === 0
        ) {
          getProduct.activate = false;
        }
        await updateProductApi(getProduct);
      }
    };

    const updateUserDiscount = async () => {
      const user = await getUserApi(currentUser["_id"]);
      user.discount = "";
      secureLocalStorage.setItem("currentUser", JSON.stringify(user));
      await updateUserApi(user);
    };

    const clearShoppingCart = async () => {
      secureLocalStorage.removeItem("shoppingCart");
      shoppingCart.length = 0;
    };

    fetchData().catch(console.error);
  }, [props.ResCode, props, shoppingCart, refId, currentUser]);

  const confirmation = () => {
    setTimeout(() => {
      setToggleContainer("orders");
      const api = Kavenegar.KavenegarApi({
        apikey: kavenegarKey,
      });
      api.VerifyLookup(
        {
          receptor: currentUser.phone,
          token: refId,
          template: "confirmation",
        },
        function (response, status) {}
      );
    }, 1000);
    Router.push("/");
  };

  return (
    <div>
      {displayConfirmation && (
        <div className={classes.confirmationContainer}>
          <div>
            <p className={classes.title}>دلماره از خرید شما تشکر میکند</p>
            <div className={classes.row}>
              <p>کد رهگیری</p>
              <p className={classes.title}>{refId}</p>
            </div>
            <div className={classes.row}>
              {displayButton ? (
                <button className="mainButton" onClick={() => confirmation()}>
                  کمد من
                </button>
              ) : (
                <div className={classes.loading}>
                  <p>لطفا صبر کنید و صفحه را نبندید </p>
                  <Image
                    width={50}
                    height={50}
                    src={loadingImage}
                    alt="isLoading"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {displayReject && (
        <div className={classes.rejectContainer}>
          <div>
            <CancelIcon sx={{ color: "#d40d12", fontSize: 50 }} />
            <p className={classes.rejectMsg}>پرداخت نا موفق</p>
            <p>خطا در انجام تراکنش</p>
            <button
              className="mainButton"
              onClick={() => {
                Router.push("/");
              }}
            >
              ادامه خرید
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  const props = {
    SaleReferenceId: "",
    ResCode: "",
    SaleOrderId: "",
  };
  const { req } = context;

  const streamPromise = new Promise((resolve, reject) => {
    let postBody = "";

    req.on("data", (data) => {
      postBody += data.toString();
    });

    req.on("end", () => {
      const postData = qs.parse(postBody);
      resolve(postData);
    });
  });

  try {
    const { SaleReferenceId, ResCode, SaleOrderId } = await streamPromise;
    props.SaleReferenceId = SaleReferenceId;
    props.ResCode = ResCode;
    props.SaleOrderId = SaleOrderId;

    return {
      props: {
        props: JSON.parse(JSON.stringify(props)),
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
