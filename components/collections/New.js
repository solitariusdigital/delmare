import { useState, useContext } from "react";
import { StateContext } from "../../context/stateContext";
import Product from "../Product";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";
import classes from "./Collections.module.scss";
import Image from "next/image";
import { getProductApi, updateProductApi } from "../../services/api";

function New() {
  const { displayProduct, setDisplayProduct } = useContext(StateContext);
  const { selectedProduct, setSelectedProduct } = useContext(StateContext);
  const { productsCollection, setProductsCollection } =
    useContext(StateContext);

  // const favourProduct = (index) => {
  //   newCollection.map((product, i) => {
  //     if (i === index) {
  //       product.favoured = !product.favoured;
  //     }
  //   });
  //   setNewCollection([...newCollection]);
  // };

  const selectProduct = async (product) => {
    // on each click update views count
    const getData = await getProductApi(product["_id"]);
    let updateData = {
      ...getData,
      views: product.views + 1,
    };
    let data = await updateProductApi(updateData);
    setSelectedProduct(data);
    console.log(productsCollection);
    setDisplayProduct(true);
  };

  return (
    <div className="collection-grid">
      {!displayProduct &&
        productsCollection.map((product, index) => (
          <div key={index} className="product">
            <div className="banner">
              <div className="social">
                <p>{product.views}</p>
                <VisibilityIcon className="icon" />
              </div>
              <div className="social">
                <p>{product.likes}</p>
                {/* <div>
                  {product.favoured ? (
                    <FavoriteIcon
                      className="iconRed"
                      onClick={() => favourProduct(index)}
                    />
                  ) : (
                    <FavoriteBorderIcon
                      className="icon"
                      onClick={() => favourProduct(index)}
                    />
                  )}
                </div> */}
              </div>
            </div>
            <Image
              onClick={() => selectProduct(product)}
              className={classes.image}
              src={product.images.main}
              alt="image"
              layout="fill"
              objectFit="cover"
              priority={true}
            />
          </div>
        ))}
      {displayProduct && <Product />}
    </div>
  );
}

export default New;
