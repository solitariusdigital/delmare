import { useState, useContext, useEffect } from "react";
import { StateContext } from "../../context/stateContext";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCart from "./ShoppingCart.module.scss";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { getInvoiceApi } from "../../services/api";
import Image from "next/image";
import graphic from "../../assets/wardrobe.png";
import { convertNumber, convertDate } from "../../services/utility";

export default function Orders() {
  const { toggleContainer, setToggleContainer } = useContext(StateContext);
  const { currentUser, seCurrentUser } = useContext(StateContext);
  const [orders, setOrders] = useState([]);
  const { shoppingCart, setShoppingCart } = useContext(StateContext);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getInvoiceApi();
      setOrders(
        data.filter((item, i) => {
          return item.userId === currentUser["_id"];
        })
      );
    };
    fetchData().catch(console.error);
  }, [setOrders, currentUser]);

  return (
    <div className={ShoppingCart.slider} style={{ height: window.innerHeight }}>
      <div className={ShoppingCart.menu}>
        <div className={ShoppingCart.topBar}>
          <CloseIcon className="icon" onClick={() => setToggleContainer("")} />
          <div className={ShoppingCart.title}>
            <p>کمد من</p>
          </div>
          <div className="shoppingcart-icon">
            <ShoppingCartIcon
              className="icon"
              onClick={() => setToggleContainer("cart")}
            />
            <p>{shoppingCart.length === 0 ? "" : shoppingCart.length}</p>
          </div>
        </div>
        <div className={ShoppingCart.orders}>
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
                    <p className={ShoppingCart.title}>تحویل</p>
                    <p>{order.deliveryType}</p>
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
          {orders.length === 0 && (
            <div className={ShoppingCart.graphic}>
              <p>آیتم خریداری شده شما اینجا نمایش داده میشود</p>
              <Image
                src={graphic}
                alt="image"
                objectFit="contain"
                layout="fill"
              />
              <a
                href="https://www.vecteezy.com/free-png/shopping-cart"
                rel="noreferrer"
                target="_blank"
              >
                Graphic by Vecteezy
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
