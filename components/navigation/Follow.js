import { useContext, Fragment, useState, useEffect } from "react";
import { StateContext } from "../../context/stateContext";
import ShoppingCart from "./ShoppingCart.module.scss";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { getBloggersApi, getUserApi } from "../../services/api";
import Image from "next/image";
import classes from "./Follow.module.scss";
import Router from "next/router";
import starGraphic from "../../assets/star.png";
import Person4Icon from "@mui/icons-material/Person4";

export default function Follow() {
  const { shoppingCart, setShoppingCart } = useContext(StateContext);
  const { toggleContainer, setToggleContainer } = useContext(StateContext);
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const [bloggers, setBloggers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const bloggersData = await getBloggersApi();
      const user = await getUserApi(currentUser["_id"]);
      setBloggers(
        bloggersData.filter((blogger) => user.follows.includes(blogger["_id"]))
      );
    };
    fetchData().catch(console.error);
  }, [currentUser]);

  return (
    <div className={ShoppingCart.slider} style={{ height: window.innerHeight }}>
      <div className={ShoppingCart.menu}>
        <div className={ShoppingCart.topBar}>
          <CloseIcon className="icon" onClick={() => setToggleContainer("")} />
          <div className={ShoppingCart.title}>
            <p>بلاگرز من</p>
          </div>
          <div className="shoppingcart-icon">
            <ShoppingCartIcon
              className="icon"
              onClick={() => setToggleContainer("cart")}
            />
            <p>{shoppingCart.length === 0 ? "" : shoppingCart.length}</p>
          </div>
        </div>
        {bloggers.length === 0 && (
          <div className={ShoppingCart.graphic} style={{ marginTop: "50px" }}>
            <p>لیست بلاگرز مورد علاقه شما اینجا نمایش داده میشود</p>
            <Image
              src={starGraphic}
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
        {bloggers.length > 0 && (
          <div className="collection-grid container-list">
            {bloggers.map((blogger, index) => (
              <Fragment key={index}>
                <div className="product">
                  <div className="banner">
                    <div className={classes.social}>
                      <p className={classes.value}>
                        {blogger.followers.length}
                      </p>
                      <Person4Icon sx={{ fontSize: 22 }} />
                    </div>
                    <p className="title">{blogger.name}</p>
                  </div>
                  <Image
                    className={classes.image}
                    onClick={() => {
                      setToggleContainer("");
                      Router.push(`/collections/bloggers/${blogger.delmareId}`);
                    }}
                    src={blogger.image}
                    alt="image"
                    layout="fill"
                    objectFit="cover"
                    priority
                    loading="eager"
                  />
                </div>
              </Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
