import { Fragment } from "react";
import MainNavigation from "../components/navigation/MainNavigation";

function Layout(props) {
  return (
    <Fragment>
      <div className="navigation">
        <MainNavigation />
      </div>
      <main>{props.children}</main>
    </Fragment>
  );
}

export default Layout;
