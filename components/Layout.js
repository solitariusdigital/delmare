import { useContext, Fragment } from "react";
import { StateContext } from "../context/stateContext";
import Container from "./navigation/Container";
import SanitizerIcon from "@mui/icons-material/Sanitizer";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import Router from "next/router";
import FavoriteIcon from "@mui/icons-material/Favorite";

function Layout(props) {
  const { container, setContainer } = useContext(StateContext);
  const { toggleContainer, setToggleContainer } = useContext(StateContext);
  const { userLogIn, setUserLogin } = useContext(StateContext);
  const { menu, setMenu } = useContext(StateContext);
  const { register, setRegister } = useContext(StateContext);
  const { navigationBottom, setNavigationBottom } = useContext(StateContext);
  const { toggleType, setToggleType } = useContext(StateContext);
  const { bar, setBar } = useContext(StateContext);

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
              className={toggleType === "care" ? "navigationActive" : "icon"}
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
  );
}

export default Layout;
