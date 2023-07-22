import { useContext, useState, Fragment } from "react";
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

  const navigateMenu = (action) => {
    if (userLogIn) {
      setToggleContainer(action);
    } else {
      setMenu(true);
      setRegister(true);
    }
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
            {toggleType === "clothing" ? (
              <CheckroomIcon
                className="navigationActive"
                onClick={() => {
                  setToggleType("clothing");
                  Router.push("/collections/clothing");
                }}
              />
            ) : (
              <CheckroomIcon
                className="icon"
                onClick={() => {
                  setToggleType("clothing");
                  Router.push("/collections/clothing");
                }}
              />
            )}
            {toggleType === "care" ? (
              <SanitizerIcon
                className="navigationActive"
                onClick={() => {
                  setToggleType("care");
                  Router.push("/collections/care");
                }}
              />
            ) : (
              <SanitizerIcon
                className="icon"
                onClick={() => {
                  setToggleType("care");
                  Router.push("/collections/care");
                }}
              />
            )}
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
