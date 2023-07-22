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
            <CheckroomIcon
              className="icon"
              onClick={() => Router.push("/collections/clothing")}
            />
            <SanitizerIcon
              className="icon"
              onClick={() => Router.push("/collections/care")}
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
