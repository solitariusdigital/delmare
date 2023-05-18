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
import Kavenegar from "kavenegar";
import { calculatePercentage } from "../../services/utility";

export default function Confirmation({ props }) {
  const { toggleContainer, setToggleContainer } = useContext(StateContext);
  const { shoppingCart, setShoppingCart } = useContext(StateContext);
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const { kavenegarKey, setKavenegarKey } = useContext(StateContext);
  const { container, setContainer } = useContext(StateContext);

  const [displayReject, setDisplayReject] = useState(false);
  const [displayConfirmation, setDisplayConfirmation] = useState(false);
  const [clickConfirm, setClickConfirm] = useState(true);
  const [refId, setRefId] = useState("");

  useEffect(() => {
    document.body.style.background = "#ffffff";
    setContainer(false);
  }, [setContainer]);

  useEffect(() => {
    const processOrder = async () => {
      if (props.ResCode === "0") {
        try {
          const check = await postMellatApi(props);
          if (check.code === 200) {
            setRefId(check.refId);
            setDisplayConfirmation(true);
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
    processOrder().catch(console.error);
  }, [props]);

  const generateInvoice = async () => {
    try {
      await Promise.all(shoppingCart.map(updateProductData));
      await updateUserDiscount();
      clearShoppingCart();
    } catch (error) {
      console.error(error);
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
      price:
        currentUser.discount && currentUser.discount !== ""
          ? product.price -
            calculatePercentage(currentUser.discount, product.price)
          : product.price,
      color: product.color,
      size: product.size,
      image: product.image,
      deliveryType: product.deliveryType,
      bloggerDelmareId: product.bloggerDelmareId,
      posted: false,
    };
  };

  const updateProductCount = async (product) => {
    try {
      let getProduct = await getProductApi(product["_id"]);
      const size = getProduct.size[product.size];
      const colorCount = size.colors[product.color];
      if (colorCount > 0) {
        size.colors[product.color]--;
        if (
          Object.keys(getProduct.size).length === 1 &&
          Object.keys(size.colors).length === 1 &&
          colorCount === 0
        ) {
          getProduct.activate = false;
        }
        await updateProductApi(getProduct);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateUserDiscount = async () => {
    try {
      const user = await getUserApi(currentUser["_id"]);
      user.discount = "";
      secureLocalStorage.setItem("currentUser", JSON.stringify(user));
      await updateUserApi(user);
    } catch (error) {
      console.error(error);
    }
  };

  const clearShoppingCart = () => {
    secureLocalStorage.removeItem("shoppingCart");
    setShoppingCart([]);
  };

  const confirmMessage = async () => {
    setClickConfirm(false);
    await generateInvoice();
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
    setTimeout(() => {
      Router.push("/");
    }, 4000);
    setTimeout(() => {
      setToggleContainer("orders");
    }, 4500);
  };

  return (
    <div className={classes.confirmPage}>
      {displayConfirmation && (
        <div className={classes.confirmationContainer}>
          {clickConfirm ? (
            <div>
              <p className={classes.title}>
                ثبت نهایی سفارش و دریافت کد رهگیری
              </p>
              <div className={classes.row}>
                <button className="mainButton" onClick={() => confirmMessage()}>
                  کد رهگیری
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className={classes.title}>دلماره از خرید شما تشکر میکند</p>
              <div className={classes.row}>
                <p>کد رهگیری</p>
                <p className={classes.title}>{refId}</p>
              </div>
            </div>
          )}
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
