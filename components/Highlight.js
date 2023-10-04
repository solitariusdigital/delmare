import classes from "./Highlight.module.scss";
import Image from "next/image";
import Router from "next/router";
import { Fragment } from "react";

export default function Highlight({ products }) {
  return (
    <div className={classes.container}>
      {products && (
        <Fragment>
          {products.map((product, index) => (
            <div key={index}>
              <Image
                onClick={() => {
                  Router.push(`/collections/product/${product["_id"]}`);
                }}
                className={classes.image}
                src={product.images.main}
                blurDataURL={product.images.main}
                placeholder="blur"
                alt="image"
                layout="fill"
                objectFit="cover"
                loading="eager"
                priority
              />
            </div>
          ))}
        </Fragment>
      )}
    </div>
  );
}
