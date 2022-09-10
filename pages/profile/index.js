import Router from "next/router";
import { Fragment } from "react";

function ProfilePage(props) {
  function getUser() {
    Router.push("/profile/u1");
    // Router.push("/profile/" + props.id);
  }

  return (
    <Fragment>
      <h1>The profile page</h1>
      <button onClick={getUser}>get user</button>
    </Fragment>
  );
}

export default ProfilePage;
