import { Fragment, useContext, useEffect, useState } from "react";
import { StateContext } from "../context/stateContext";
import secureLocalStorage from "react-secure-storage";
import Head from "next/head";
import { convertDate } from "../services/utility";
import classes from "./page.module.scss";
import Router from "next/router";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import RefreshIcon from "@mui/icons-material/Refresh";
import dbConnect from "../services/dbConnect";
import userModel from "../models/User";

export default function Users({ sortedUsers }) {
  const { container, setContainer } = useContext(StateContext);
  const { navigationBottom, setNavigationBottom } = useContext(StateContext);
  const [displayPage, setDisplayPage] = useState(false);

  useEffect(() => {
    if (
      !JSON.parse(secureLocalStorage.getItem("currentUser")) ||
      JSON.parse(secureLocalStorage.getItem("currentUser"))["permission"] ===
        "admin"
    ) {
      setContainer(false);
      setDisplayPage(true);
      setNavigationBottom(false);
    } else {
      Router.push("/");
    }
  }, [setContainer, setNavigationBottom]);

  return (
    <Fragment>
      {displayPage && (
        <Fragment>
          <Head>
            <title>Users</title>
            <meta name="description" content="Users list" />
          </Head>
          <div className="navigationBar">
            <ArrowBackIosNewIcon
              className="icon"
              onClick={() => Router.push("/")}
              sx={{ fontSize: 30 }}
            />
            <h3>{sortedUsers.length}</h3>
            <RefreshIcon
              className="icon"
              onClick={() => Router.reload(window.location.pathname)}
              sx={{ fontSize: 30 }}
            />
          </div>
          <div className="user-page">
            {sortedUsers.map((user, index) => (
              <div
                key={index}
                className={classes.infoCard}
                style={{ marginTop: "0px" }}
              >
                <div className={classes.row}>
                  <p className={classes.title}>نام</p>
                  <p>{user.name === "" ? "-" : user.name}</p>
                </div>
                <div className={classes.row}>
                  <p className={classes.title}>موبایل</p>
                  <p>{user.phone}</p>
                </div>
                <div className={classes.row}>
                  <p className={classes.title}>آیتم آرزو</p>
                  <p>{user.favourites.length}</p>
                </div>
                <div className={classes.row}>
                  <p className={classes.title}>عضویت</p>
                  <p suppressHydrationWarning>{convertDate(user.createdAt)}</p>
                </div>
                <div className={classes.row}>
                  <p className={classes.title}>فعالیت</p>
                  <p suppressHydrationWarning>{convertDate(user.updatedAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
}

// initial connection to db
export async function getServerSideProps(context) {
  try {
    await dbConnect();
    const users = await userModel.find();
    const sortedUsers = users.sort(function (a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    return {
      props: {
        sortedUsers: JSON.parse(JSON.stringify(sortedUsers)),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
}
