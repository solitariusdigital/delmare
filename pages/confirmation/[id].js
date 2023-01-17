import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import { StateContext } from "../../context/stateContext";
import classes from "../page.module.scss";
import Router from "next/router";
import {
  createInvoiceApi,
  getProductApi,
  updateProductApi,
} from "../../services/api";
import secureLocalStorage from "react-secure-storage";
import Kavenegar from "kavenegar";

export default function ConfirmationId() {
  const { shoppingCart, setShoppingCart } = useContext(StateContext);
  const { currentUser, seCurrentUser } = useContext(StateContext);
  const { container, setContainer } = useContext(StateContext);
  const { toggleContainer, setToggleContainer } = useContext(StateContext);
  const { kavenegarKey, setKavenegarKey } = useContext(StateContext);

  const [refId, setRefId] = useState("");
  const [displayConfirmation, setDisplayConfirmation] = useState(false);
  const [divHeight, setDivHeight] = useState(null);

  const router = useRouter();
  let id = router.query.id;

  useEffect(() => {
    document.body.style.background = "#ffffff";
    setDivHeight(window.innerHeight);

    setContainer(false);
    setRefId(JSON.parse(secureLocalStorage.getItem("refId")));

    if (parseInt(id) === JSON.parse(secureLocalStorage.getItem("refId"))) {
      setDisplayConfirmation(true);
      // create invoice with customer and product info
      shoppingCart.forEach(async (product) => {
        // get latest product and update count and save on db
        let getProduct = await getProductApi(product["_id"]);
        if (getProduct.size[product.size].colors[product.color] > 0) {
          getProduct.size[product.size].colors[product.color]--;
          if (
            Object.keys(getProduct.size[product.size].colors).length === 1 &&
            getProduct.size[product.size].colors[product.color] === 0
          ) {
            getProduct.activate = false;
          }
          await updateProductApi(getProduct);
        }

        const invoice = {
          name: currentUser.name,
          phone: currentUser.phone,
          address: currentUser.address,
          post: currentUser.post,
          userId: currentUser["_id"],
          productId: product["_id"],
          delmareId: product.delmareId,
          refId: JSON.parse(secureLocalStorage.getItem("refId")),
          title: product.title,
          price: product.price,
          color: product.color,
          size: product.size,
          image: product.image,
          deliveryType: product.deliveryType,
          posted: false,
        };
        await createInvoiceApi(invoice);

        setTimeout(() => {
          secureLocalStorage.removeItem("refId");
          localStorage.removeItem("shoppingCart");
          shoppingCart.length = 0;
        }, 1000);
      });
    }
  }, [setContainer, shoppingCart, currentUser, id]);

  const confirmation = () => {
    Router.push("/");
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
    }, 200);
  };

  return (
    <div
      className={classes.confirmationContainer}
      style={{ height: divHeight }}
    >
      {displayConfirmation ? (
        <div>
          <p className={classes.title}>دلماره از خرید شما تشکر میکند</p>
          <div className={classes.row}>
            <p>کد رهگیری</p>
            <p className={classes.title}>{refId}</p>
          </div>
          <div className={classes.row}>
            <button className="mainButton" onClick={() => confirmation()}>
              کمد من
            </button>
          </div>
        </div>
      ) : (
        <div className={classes.rejectContainer}>
          <p className={classes.title}>خطا در کد رهگیری ارسالی</p>
          <button
            className="mainButton"
            onClick={() => {
              Router.push("/");
            }}
          >
            صفحه اصلی
          </button>
        </div>
      )}
    </div>
  );
}
