import classes from "./Highlight.module.scss";
import Image from "next/image";
import Router from "next/router";

export default function Highlight({ products }) {
  return (
    <div className={classes.container}>
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
            width={100}
            height={140}
            objectFit="cover"
            loading="eager"
            priority
          />
        </div>
      ))}
    </div>
  );
}
