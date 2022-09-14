import { Fragment } from "react";
import Router from "next/router";

import classes from "./LandingPage.module.scss";
import Image from "next/image";
import image from "../assets/home.png";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";

function LandingPage() {
  return (
    <div className={classes.container}>
      <div className={classes.banner}>
        <p>متفاوت بپوشیم</p>
      </div>
      <Image
        className={classes.image}
        src={image}
        alt="image"
        layout="fill"
        objectFit="cover"
      />
      <div className={classes.message}>
        <p>
          یک خرید اینترنتی مطمئن، نیازمند فروشگاهی است که بتواند کالاهایی متنوع،
          باکیفیت و دارای قیمت مناسب را به دست مشتریان خود برساند
        </p>
      </div>
      <div className={classes.icon}>
        <ExpandCircleDownIcon
          className="icon"
          fontSize="large"
          sx={{ color: "#b2ffef", fontSize: 50 }}
          onClick={() => Router.push("/new")}
        />
      </div>
    </div>
  );
}

export default LandingPage;
