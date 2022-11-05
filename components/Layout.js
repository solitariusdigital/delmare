import { useContext, Fragment } from "react";
import { StateContext } from "../context/stateContext";
import Container from "./navigation/Container";

function Layout(props) {
  const { container, setContainer } = useContext(StateContext);

  return (
    <Fragment>
      {container && (
        <div className="navigation">
          <Container />
        </div>
      )}
      <main>{props.children}</main>
    </Fragment>
  );
}

export default Layout;
