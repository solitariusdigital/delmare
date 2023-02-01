import { Fragment, useContext, useEffect, useState } from "react";
import { StateContext } from "../context/stateContext";
import secureLocalStorage from "react-secure-storage";
import { getUsersApi } from "../services/api";
import Head from "next/head";
import { convertDate } from "../services/utility";
import classes from "./page.module.scss";
import Router from "next/router";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import RefreshIcon from "@mui/icons-material/Refresh";

export default function Users() {
  const { container, setContainer } = useContext(StateContext);
  const { appUsers, setAppUsers } = useContext(StateContext);
  const [displayPage, setDisplayPage] = useState(false);

  useEffect(() => {
    if (
      !JSON.parse(secureLocalStorage.getItem("currentUser")) ||
      JSON.parse(secureLocalStorage.getItem("currentUser"))["permission"] ===
        "admin"
    ) {
      setContainer(false);
      setDisplayPage(true);
    } else {
      Router.push("/");
    }
  }, [setContainer]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUsersApi();
      setAppUsers(
        data.sort(function (a, b) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        })
      );
    };
    fetchData().catch(console.error);
  }, [setAppUsers]);

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
            <h3>تعداد مشتری {appUsers.length}</h3>
            <RefreshIcon
              className="icon"
              onClick={() => Router.reload(window.location.pathname)}
              sx={{ fontSize: 30 }}
            />
          </div>
          <div className="user-page">
            {appUsers.map((user, index) => (
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
                  <p className={classes.title}>تولد</p>
                  <p>{user.birthday === "" ? "-" : user.birthday}</p>
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
