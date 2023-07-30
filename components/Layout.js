import { useContext, useState, useEffect, Fragment } from "react";
import { StateContext } from "../context/stateContext";
import Container from "./navigation/Container";
import SanitizerIcon from "@mui/icons-material/Sanitizer";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import Router from "next/router";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Image from "next/image";
import loadingImage from "../assets/loaderUpdate.png";
import logo from "../assets/logo.svg";
import { getNotificationsApi } from "../services/api";

function Layout(props) {
  const { container, setContainer } = useContext(StateContext);
  const { toggleContainer, setToggleContainer } = useContext(StateContext);
  const { userLogIn, setUserLogin } = useContext(StateContext);
  const { menu, setMenu } = useContext(StateContext);
  const { register, setRegister } = useContext(StateContext);
  const { navigationBottom, setNavigationBottom } = useContext(StateContext);
  const { toggleType, setToggleType } = useContext(StateContext);
  const { bar, setBar } = useContext(StateContext);
  const [loadAppUpdate, setLoadUpdate] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const data = await getNotificationsApi();
      setLoadUpdate(data[0].update);
    };
    fetchData().catch(console.error);
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
      {loadAppUpdate.active ? (
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
                    controlNavigation("care");
                  }}
                />
                <FavoriteIcon
                  className="icon"
                  onClick={() => navigateMenu("wish")}
                />
              </div>
            </div>
          )}
        </Fragment>
      ) : (
        <div className="loadAppUpdate">
          <Image width={120} height={120} src={loadingImage} alt="isLoading" />
          <p>{loadAppUpdate.text}</p>
          <Image width={90} height={140} src={logo} alt="logo" />
        </div>
      )}
    </Fragment>
  );
}

export default Layout;
