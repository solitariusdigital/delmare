import { useState, useEffect, Fragment, useContext } from "react";
import classes from "./Brands.module.scss";
import { getBrandsApi } from "../services/api";
import Image from "next/image";
import loadingImage from "../assets/loader.png";
import Router from "next/router";
import ShareIcon from "@mui/icons-material/Share";
import { StateContext } from "../context/stateContext";

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const { bar, setBar } = useContext(StateContext);
  const { searchControl, setSearchControl } = useContext(StateContext);

  useEffect(() => {
    setBar(true);
    setSearchControl(false);

    const fetchData = async () => {
      const data = await getBrandsApi();
      setBrands(
        data.sort(function (a, b) {
          return b.products.length - a.products.length;
        })
      );
    };
    fetchData().catch(console.error);
  }, [setBrands, setBar, setSearchControl]);

  return (
    <Fragment>
      <div className={classes.loader}>
        {brands.length === 0 && (
          <Image width={50} height={50} src={loadingImage} alt="isLoading" />
        )}
      </div>
      <div className={classes.brands}>
        {brands.map((brand, index) => (
          <div key={index} className={classes.brand}>
            <p className={classes.title}>{brand.title}</p>
            <div className={classes.share}>
              <ShareIcon
                className="icon"
                onClick={() =>
                  navigator.clipboard.writeText(
                    `delmareh.com/collections/brands/${brand.delmareId}`
                  )
                }
                sx={{ fontSize: 16 }}
              />
            </div>
            <div className={classes.logo}>
              <Image
                className={classes.image}
                src={brand.logo}
                width={100}
                height={100}
                alt="logo"
                onClick={() =>
                  Router.push(`/collections/brands/${brand.delmareId}`)
                }
              />
            </div>
            <div className={classes.row}>
              <p className={classes.value}>{brand.products.length}</p>
              <p className={classes.count}>آیتم و طرح</p>
            </div>
          </div>
        ))}
      </div>
    </Fragment>
  );
}
