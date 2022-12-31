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

export default function ConfirmationId() {
  const { shoppingCart, setShoppingCart } = useContext(StateContext);
  const { currentUser, seCurrentUser } = useContext(StateContext);
  const { container, setContainer } = useContext(StateContext);
  const { toggleContainer, setToggleContainer } = useContext(StateContext);

  const [refId, setRefId] = useState("");
  const [displayConfirmation, setDisplayConfirmation] = useState(false);

  const router = useRouter();
  let id = router.query.id;

  useEffect(() => {
    setContainer(false);
    setRefId(JSON.parse(localStorage.getItem("refId")));

    if (parseInt(id) === JSON.parse(localStorage.getItem("refId"))) {
      setDisplayConfirmation(true);
      // create invoice with customer and product info
      shoppingCart.forEach(async (product) => {
        // get latest product and update count and save on db
        let getProduct = await getProductApi(product["_id"]);
        if (getProduct.size[product.size].colors[product.color] > 0) {
          getProduct.size[product.size].colors[product.color]--;
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
          refId: JSON.parse(localStorage.getItem("refId")),
          title: product.title,
          price: product.price,
          color: product.color,
          size: product.size,
          image: product.image,
          posted: false,
        };
        await createInvoiceApi(invoice);

        setTimeout(() => {
          localStorage.removeItem("refId");
          localStorage.removeItem("shoppingCart");
          shoppingCart.length = 0;
        }, 1000);
      });
    }
  }, [setContainer, shoppingCart, currentUser, id]);

  return (
    <div className={classes.confirmationContainer}>
      {displayConfirmation ? (
        <div>
          <p className={classes.title}>دلماره از خرید شما تشکر میکند</p>
          <div className={classes.row}>
            <p>کد رهگیری</p>
            <p className={classes.title}>{refId}</p>
          </div>
          <div className={classes.row}>
            <button
              className="mainButton"
              onClick={() => {
                Router.push("/");
                setTimeout(() => {
                  setToggleContainer("orders");
                }, 200);
              }}
            >
              کمد من
            </button>
          </div>
        </div>
      ) : (
        <p className={classes.title}>خطا در کد رهگیری ارسالی</p>
      )}
    </div>
  );
}
