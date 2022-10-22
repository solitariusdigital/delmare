import { useContext, useState, useEffect, useRef } from "react";
import { StateContext } from "../../context/stateContext";
import classes from "./AddHomeScreen.module.scss";
import IosShareIcon from "@mui/icons-material/IosShare";
import AddBoxIcon from "@mui/icons-material/AddBox";

export default function AddHomeScreen() {
  const { toggleContainer, setToggleContainer } = useContext(StateContext);

  return (
    <div className={classes.popup}>
      <p className={classes.title}>
        برای استفاده سریع و آسان وب اپلیکیشن دلماره را به صفحه اصلی اضافه کنید
      </p>
      <div className={classes.items}>
        <p>را در نوار پایین کلیک کنید Share دکمه</p>
        <IosShareIcon
          className="icon"
          onClick={() => setCheckToken("")}
          sx={{ fontSize: 16 }}
        />
      </div>
      <div className={classes.items}>
        <p>را انتخاب کنید Add to Home Screen گزینه</p>
        <AddBoxIcon
          className="icon"
          onClick={() => setCheckToken("")}
          sx={{ fontSize: 16 }}
        />
      </div>
      <div className={classes.items}>
        <p>کلیک کنید Add در قسمت بالا روی</p>
        <p>Add</p>
      </div>
      <button className="mainButton" onClick={() => setToggleContainer("")}>
        انجام شد
      </button>
    </div>
  );
}
