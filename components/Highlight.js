import { useState, useEffect } from "react";
import { getProducstApi } from "../services/api";
import classes from "./Highlight.module.scss";
import Image from "next/image";
import Router from "next/router";

export default function Highlight() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProducstApi();
      setProducts(
        data
          .filter((product) => {
            return product.activate;
          })
          .sort((a, b) => {
            return b.views - a.views;
          })
          .slice(0, 6)
      );
    };
    fetchData().catch(console.error);
  }, []);

  return (
    <div className={classes.container}>
      {products.map((product, index) => (
        <div key={index}>
          <Image
            onClick={() =>
              Router.push(`/collections/product/${product["_id"]}`)
            }
            className={classes.image}
            src={product.images.main}
            blurDataURL={product.images.main}
            placeholder="blur"
            alt="image"
            width={55}
            height={55}
            objectFit="cover"
            loading="eager"
            priority
          />
        </div>
      ))}
    </div>
  );
}
