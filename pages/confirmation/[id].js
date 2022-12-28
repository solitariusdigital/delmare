import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import { StateContext } from "../../context/stateContext";
import Router from "next/router";
import {
  createInvoiceApi,
  getProductApi,
  updateProductApi,
  getInvoiceApi,
} from "../../services/api";
import classes from "../page.module.scss";
import Image from "next/image";
import ShoppingCart from "../../components/navigation/ShoppingCart.module.scss";
import { convertNumber, convertDate } from "../../services/utility";

export default function ConfirmationId() {
  const { shoppingCart, setShoppingCart } = useContext(StateContext);
  const [refId, setRefId] = useState("");
  const { currentUser, seCurrentUser } = useContext(StateContext);
  const [displayConfirmation, setDisplayConfirmation] = useState(false);
  const { container, setContainer } = useContext(StateContext);
  const [orders, setOrders] = useState([]);
  const { toggleContainer, setToggleContainer } = useContext(StateContext);

  const router = useRouter();
  let id = router.query.id;

  useEffect(() => {
    setContainer(false);
    setRefId(JSON.parse(localStorage.getItem("refId")));
    if (id === JSON.parse(localStorage.getItem("refId"))) {
      setDisplayConfirmation(true);
      // create invoice with customer and product info
      shoppingCart.forEach(async (product) => {
        // let getProduct = await getProductApi(product["_id"]);
        // getProduct.size[product.size].colors[product.color]--;
        // await updateProductApi(getProduct);
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
        console.log("111");
      });
    }
  }, [id, shoppingCart, currentUser, setContainer]);

  useEffect(() => {
    setTimeout(() => {
      const fetchData = async () => {
        const data = await getInvoiceApi();
        console.log("222");
        setOrders(
          data.filter((item, i) => {
            return (
              item.userId ===
                JSON.parse(localStorage.getItem("currentUser"))["_id"] &&
              item.refId === JSON.parse(localStorage.getItem("refId"))
            );
          })
        );
      };
      fetchData().catch(console.error);
      setTimeout(() => {
        localStorage.removeItem("refId");
      }, 5000);
    }, 1000);
  }, [setOrders, currentUser]);

  return (
    <div className={classes.confirmationContainer}>
      {true ? (
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
          <div className={`${ShoppingCart.orders} ${classes.orders}`}>
            {orders
              .map((order, index) => (
                <div key={index} className={ShoppingCart.order}>
                  <div>
                    <Image
                      className={ShoppingCart.image}
                      src={order.image}
                      objectFit="cover"
                      width={100}
                      height={140}
                      alt="image"
                    />
                    <div className={ShoppingCart.features}>
                      <p className={ShoppingCart.size}>{order.size}</p>
                      <div
                        className={ShoppingCart.color}
                        style={{ backgroundColor: `#${order.color}` }}
                      ></div>
                    </div>
                  </div>
                  <div className={ShoppingCart.rows}>
                    <div className={ShoppingCart.row}>
                      <p className={ShoppingCart.title}>آیتم</p>
                      <p>{order.title}</p>
                    </div>
                    <div className={ShoppingCart.row}>
                      <p className={ShoppingCart.title}>کد آیتم</p>
                      <p>{order.delmareId}</p>
                    </div>
                    <div className={ShoppingCart.row}>
                      <p className={ShoppingCart.title}>کد رهگیری</p>
                      <p>{order.refId}</p>
                    </div>
                    <div className={ShoppingCart.row}>
                      <p className={ShoppingCart.title}>قیمت</p>
                      <p>{convertNumber(order.price)} T</p>
                    </div>
                    <div className={ShoppingCart.row}>
                      <p className={ShoppingCart.title}>تاریخ خرید</p>
                      <p suppressHydrationWarning>
                        {convertDate(order.createdAt)}
                      </p>
                    </div>
                    <div className={ShoppingCart.row}>
                      <p className={ShoppingCart.title}>وضعیت</p>
                      {order.posted ? (
                        <div className={ShoppingCart.status}>
                          <p suppressHydrationWarning>
                            ارسال شده<span>{convertDate(order.updatedAt)}</span>
                          </p>
                        </div>
                      ) : (
                        <p>آماده سازی</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
              .reverse()}
          </div>
        </div>
      ) : (
        <p className={classes.title}>خطا در کد رهگیری ارسالی</p>
      )}
    </div>
  );
}
