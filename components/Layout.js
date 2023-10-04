import { useContext, useState, useEffect, Fragment } from "react";
import { StateContext } from "../context/stateContext";
import Container from "./navigation/Container";
import SanitizerIcon from "@mui/icons-material/Sanitizer";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import Router from "next/router";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Image from "next/legacy/image";
import loadingImage from "../assets/loaderUpdate.png";
import logo from "../assets/logo.svg";
import brand from "../assets/brand.svg";
import lemon from "../assets/lemon.png";

import { getNotificationsApi, getUserApi } from "../services/api";
import secureLocalStorage from "react-secure-storage";

export default function Layout(props) {
  const { container, setContainer } = useContext(StateContext);
  const { register, setRegister } = useContext(StateContext);
  const { navigationBottom, setNavigationBottom } = useContext(StateContext);
  const { menu, setMenu } = useContext(StateContext);
  const { toggleContainer, setToggleContainer } = useContext(StateContext);
  const { bar, setBar } = useContext(StateContext);
  const { shoppingCart, setShoppingCart } = useContext(StateContext);
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const { toggleType, setToggleType } = useContext(StateContext);
  const { userLogIn, setUserLogin } = useContext(StateContext);
  const [loadAppUpdate, setLoadUpdate] = useState({});
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getNotificationsApi();
      setLoadUpdate(data[0].update);
    };
    fetchData().catch(console.error);
    setTimeout(() => {
      setLoader(true);
    }, 1400);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUserData = JSON.parse(
          secureLocalStorage.getItem("currentUser")
        );
        if (currentUserData) {
          setUserLogin(true);
          const user = await getUserApi(currentUserData["_id"]);
          setCurrentUser(user);
          secureLocalStorage.setItem("currentUser", JSON.stringify(user));
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [setUserLogin, setCurrentUser]);

  useEffect(() => {
    if (JSON.parse(secureLocalStorage.getItem("shoppingCart"))) {
      setShoppingCart(JSON.parse(secureLocalStorage.getItem("shoppingCart")));
    } else {
      secureLocalStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigateMenu = (action) => {
    if (userLogIn) {
      setToggleContainer(action);
    } else {
      setMenu(true);
      setRegister(true);
    }
  };

  const controlNavigation = (type) => {
    Router.push(`/collections/${type}`);
    setToggleType(type);
    setBar(false);
  };

  return (
    <Fragment>
      {!loadAppUpdate.active ||
      (userLogIn && currentUser?.["permission"] === "admin") ? (
        <Fragment>
          {loader ? (
            <Fragment>
              {container && (
                <div className="navigationTop">
                  <Container />
                </div>
              )}
              <main className="main">{props.children}</main>
              {navigationBottom && (
                <div className="navigationBottom">
                  <div>
                    <CheckroomIcon
                      className={
                        toggleType === "clothing" ? "navigationActive" : "icon"
                      }
                      onClick={() => {
                        controlNavigation("clothing");
                      }}
                    />
                    <SanitizerIcon
                      className={
                        toggleType === "care" ? "navigationActive" : "icon"
                      }
                      onClick={() => {
                        controlNavigation("skin");
                      }}
                    />
                    <FavoriteIcon
                      className="icon iconRed"
                      onClick={() => navigateMenu("wish")}
                    />
                  </div>
                </div>
              )}
            </Fragment>
          ) : (
            <div className="loadEntry">
              <div className="lemon animate__animated animate__jackInTheBox">
                <Image
                  width={50}
                  height={50}
                  src={lemon}
                  alt="lemon"
                  priority
                />
              </div>
              <Image
                className="lemon animate__animated animate__zoomIn"
                width={160}
                height={90}
                src={brand}
                alt="brand"
                priority
              />
              <div className="lemon animate__animated animate__jackInTheBox">
                <Image
                  width={50}
                  height={50}
                  src={lemon}
                  alt="lemon"
                  priority
                />
              </div>
            </div>
          )}
        </Fragment>
      ) : (
        <div className="loadAppUpdate">
          <Image
            width={120}
            height={120}
            src={loadingImage}
            alt="isLoading"
            priority
          />
          <p>{loadAppUpdate.text}</p>
          <Image width={90} height={140} src={logo} alt="logo" priority />
        </div>
      )}
    </Fragment>
  );
}
