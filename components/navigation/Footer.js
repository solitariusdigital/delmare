/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable @next/next/no-img-element */
import classes from "./Footer.module.scss";
import Image from "next/legacy/image";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import MuseTechLab from "../../assets/MuseTechLab.svg";
import logo from "../../assets/logo.svg";

export default function Footer() {
  return (
    <div className={classes.footer}>
      <div
        onClick={() =>
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          })
        }
      >
        <Image width={90} height={140} src={logo} alt="logo" />
      </div>
      <div className={classes.copyright}>
        <p>کليه حقوق اين وب اپلیکیشن به دلماره تعلق دارد</p>
        <p>delmareh.com @Copyright 2023</p>
        <div
          className={classes.row}
          onClick={() =>
            window.open(
              "https://docs.google.com/forms/d/e/1FAIpQLSdqKHLBydQIfm06LTtw0wELHaDJJFGU3GNQFsVWNd3t0jz5hA/viewform?usp=sf_link",
              "_ self"
            )
          }
        >
          <Image
            className={classes.image}
            src={MuseTechLab}
            alt="image"
            width={120}
            height={30}
            loading="eager"
          />
          <p className={classes.action}>طراحی توسعه پشتیبانی</p>
          <PrecisionManufacturingIcon sx={{ fontSize: 18 }} />
        </div>
      </div>
    </div>
  );
}
