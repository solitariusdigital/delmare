import Router from "next/router";
import { Fragment } from "react";

function ProfilePage(props) {
  function getUser() {
    Router.push("/profile/u1");
    // Router.push("/profile/" + props.id);
  }

  return (
    <Fragment>
      <p>The profile page</p>
      <button onClick={getUser}>get user</button>
    </Fragment>
  );
}

export default ProfilePage;
