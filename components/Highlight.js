import { useContext, useState, useEffect, Fragment } from "react";
import { StateContext } from "../context/stateContext";
import classes from "./Highlight.module.scss";
import Image from "next/legacy/image";
import Router from "next/router";

export default function Highlight({ products }) {
  const { navigationTopBar, setNavigationTopBar } = useContext(StateContext);

  const selectProduct = (id) => {
    Router.push(`/collections/product/${id}`);
    navigationTopBar.map((nav, i) => {
      nav.active = false;
    });
    setNavigationTopBar([...navigationTopBar]);
  };

  return (
    <div className={classes.container}>
      {products && (
        <Fragment>
          {products.map((product, index) => (
            <div key={index}>
              <Image
                onClick={() => {
                  selectProduct(product["_id"]);
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
