import { useState, useEffect, Fragment } from "react";
import classes from "./Brands.module.scss";
import { getBrandApi } from "../services/api";
import Image from "next/image";
import loadingImage from "../assets/loader.png";

function Brands() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getBrandApi();
      setBrands(data);
    };
    fetchData().catch(console.error);
  }, [setBrands]);

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
            <Image
              src={brand.logo}
              objectFit="contain"
              width={100}
              height={100}
              alt="logo"
            />
            <div className={classes.row}>
              <p className={classes.value}>{brand.products.length}</p>
              <p className={classes.count}>تعداد آیتم و طرح</p>
            </div>
          </div>
        ))}
      </div>
    </Fragment>
  );
}

export default Brands;
