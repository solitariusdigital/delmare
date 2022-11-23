import { useState, useEffect } from "react";
import classes from "./Brands.module.scss";
import { getBrandApi } from "../services/api";
import Image from "next/image";

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
            <p>تعداد آیتم و طرح</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Brands;
