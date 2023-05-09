import { useState, useEffect, Fragment, useContext } from "react";
import classes from "./Brands.module.scss";
import Image from "next/image";
import Router from "next/router";
import { StateContext } from "../context/stateContext";

export default function Brands({ brandsData }) {
  const [brands, setBrands] = useState([]);
  const { bar, setBar } = useContext(StateContext);
  const { searchControl, setSearchControl } = useContext(StateContext);

  useEffect(() => {
    setBar(true);
    setSearchControl(false);
    const sortedBrands = brandsData.sort(
      (a, b) => b.products.length - a.products.length
    );
    setBrands(sortedBrands);
  }, [setBrands, setBar, setSearchControl, brandsData]);

  return (
    <Fragment>
      <div className={classes.brands}>
        {brandsData.map((brand, index) => (
          <div key={index} className={classes.brand}>
            <p className={classes.title}>{brand.title}</p>
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
