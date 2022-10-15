import { Fragment } from "react";
import Container from "./navigation/Container";

function Layout(props) {
  return (
    <Fragment>
      <div className="navigation">
        <Container />
      </div>
      <main>{props.children}</main>
    </Fragment>
  );
}

export default Layout;
