import { useEffect, useContext, useState } from "react";
import { StateContext } from "../../context/stateContext";
import Router from "next/router";
import { postMellatApi } from "../../services/api";
import classes from "../page.module.scss";
import CancelIcon from "@mui/icons-material/Cancel";
import qs from "querystring";
import secureLocalStorage from "react-secure-storage";
import Kavenegar from "kavenegar";

export default function Confirmation({ props }) {
  const { toggleContainer, setToggleContainer } = useContext(StateContext);
  const { shoppingCart, setShoppingCart } = useContext(StateContext);
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const { kavenegarKey, setKavenegarKey } = useContext(StateContext);
  const { container, setContainer } = useContext(StateContext);

  const [displayConfirmation, setDisplayConfirmation] = useState(true);
  const [refId, setRefId] = useState("");

  useEffect(() => {
    document.body.style.background = "#ffffff";
    setContainer(false);
  }, [setContainer]);

  useEffect(() => {
    if (shoppingCart && currentUser) {
      props.shoppingCart = shoppingCart;
      props.currentUser = currentUser;
      const processOrder = async () => {
        if (props.ResCode === "0") {
          const check = await postMellatApi(props);
          try {
            if (check.code === 200) {
              setRefId(check.refId);
              setDisplayConfirmation(true);
            } else {
              setDisplayConfirmation(false);
            }
          } catch (error) {
            console.error(error);
          }
        } else {
          setDisplayConfirmation(false);
        }
      };
      processOrder().catch(console.error);
    }
  }, [currentUser, props, shoppingCart]);

  const clearShoppingCart = () => {
    secureLocalStorage.removeItem("shoppingCart");
    setShoppingCart([]);
  };

  const confirmMessage = async () => {
    clearShoppingCart();
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
    Router.push("/");
    setTimeout(() => {
      setToggleContainer("orders");
    }, 700);
  };

  return (
    <div className={classes.confirmPage}>
      {displayConfirmation ? (
        <div className={classes.confirmationContainer}>
          <div>
            <p className={classes.title}>دلماره از خرید شما تشکر میکند</p>
            <div className={classes.row}>
              <p>کد رهگیری دلماره</p>
              <p className={classes.title}>{refId}</p>
            </div>
            <div className={classes.row}>
              <button className="mainButton" onClick={() => confirmMessage()}>
                ادامه
              </button>
            </div>
          </div>
        </div>
      ) : (
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
