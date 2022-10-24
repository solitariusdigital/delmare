import { useContext, useState, useEffect, useRef, Fragment } from "react";
import { StateContext } from "../../context/stateContext";
import classes from "./AddHomeScreen.module.scss";
import IosShareIcon from "@mui/icons-material/IosShare";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { getMobileOperatingSystem } from "../../services/utility";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddToHomeScreenIcon from "@mui/icons-material/AddToHomeScreen";
export default function AddHomeScreen() {
  const { toggleContainer, setToggleContainer } = useContext(StateContext);

  return (
    <Fragment>
      {getMobileOperatingSystem() === "ios" && (
        <div className={classes.popup}>
          <div className={classes.content}>
            <p className={classes.title}>
              وب اپلیکیشن پیشرو دلماره را برای استفاده سریع و آسان به صفحه اصلی
              اضافه کنید
            </p>
            <div className={classes.items}>
              <p>را در نوار پایین کلیک کنید Share دکمه</p>
              <IosShareIcon className="icon" sx={{ fontSize: 18 }} />
            </div>
            <div className={classes.items}>
              <p>را انتخاب کنید Add to Home Screen گزینه</p>
              <AddBoxIcon className="icon" sx={{ fontSize: 18 }} />
            </div>
            <div className={classes.items}>
              <p>کلیک کنید Add روی</p>
              <p>Add</p>
            </div>
            <button
              className="mainButton"
              onClick={() => setToggleContainer("")}
            >
              متوجه شدم
            </button>
          </div>
        </div>
      )}
      {getMobileOperatingSystem() === "android" && (
        <div className={classes.popup}>
          <div className={classes.content}>
            <p className={classes.title}>
              وب اپلیکیشن پیشرو دلماره را برای استفاده سریع و آسان به صفحه اصلی
              اضافه کنید
            </p>
            <div className={classes.items}>
              <p>را کلیک کنید Menu دکمه</p>
              <MoreVertIcon className="icon" sx={{ fontSize: 18 }} />
            </div>
            <div className={classes.items}>
              <p>را انتخاب کنید Add to Home Screen گزینه</p>
              <AddToHomeScreenIcon className="icon" sx={{ fontSize: 18 }} />
            </div>
            <div className={classes.items}>
              <p>کلیک کنید Add روی</p>
              <p>Add</p>
            </div>
            <button
              className="mainButton"
              onClick={() => setToggleContainer("")}
            >
              متوجه شدم
            </button>
          </div>
        </div>
      )}
    </Fragment>
  );
}
