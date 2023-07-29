import { useState, useEffect, useContext, Fragment } from "react";
import { StateContext } from "../context/stateContext";
import Container from "./navigation/Container";
import { getNotificationsApi } from "../services/api";
import Image from "next/image";
import loadingImage from "../assets/loaderUpdate.png";
import logo from "../assets/logo.svg";
import secureLocalStorage from "react-secure-storage";

function Layout(props) {
  const { container, setContainer } = useContext(StateContext);
  const { userLogIn, setUserLogin } = useContext(StateContext);
  const [loadAppUpdate, setLoadUpdate] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const data = await getNotificationsApi();
      setLoadUpdate(data[0].update);
    };
    fetchData().catch(console.error);
  }, []);

  return (
    <Fragment>
      {(userLogIn &&
        JSON.parse(secureLocalStorage.getItem("currentUser"))["permission"] ===
          "admin") ||
      !loadAppUpdate.active ? (
        <Fragment>
          {container && (
            <div className="navigation">
              <Container />
            </div>
          )}
          <main>{props.children}</main>
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
