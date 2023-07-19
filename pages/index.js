import { useState, Fragment } from "react";
import Head from "next/head";
import ClothesPage from "./collections/ClothesPage";
import CarePage from "./collections/CarePage";

import dbConnect from "../services/dbConnect";
import productModel from "../models/Product";

export default function HomePage({
  highlightCollection,
  newItems,
  cheapestItems,
}) {
  const [productCategory, setProductCategory] = useState("clothes" || "care");

  return (
    <Fragment>
      <Head>
        <title>Delmareh</title>
      </Head>
      <div>
        <button
          className="mainButton"
          onClick={() => {
            setProductCategory("clothes");
          }}
        >
          Clothes
        </button>
        <button
          className="mainButton"
          onClick={() => {
            setProductCategory("care");
          }}
        >
          Care
        </button>
      </div>
      {productCategory === "clothes" && (
        <ClothesPage
          highlightCollection={highlightCollection}
          newItems={newItems}
          cheapestItems={cheapestItems}
        ></ClothesPage>
      )}
      {productCategory === "care" && (
        <CarePage
          highlightCollection={highlightCollection}
          newItems={newItems}
          cheapestItems={cheapestItems}
        ></CarePage>
      )}
    </Fragment>
  );
}

// initial connection to db
export async function getServerSideProps(context) {
  try {
    await dbConnect();
    const products = await productModel.find();
    const highlightCollection = products
      .filter((product) => {
        return product.activate;
      })
      .sort((a, b) => {
        return b.views - a.views;
      })
      .slice(0, 5);
    const newItems = products
      .filter((product) => {
        return product.activate && !product.sale;
      })
      .reverse()
      .slice(0, 5);
    const cheapestItems = products
      .filter((product) => {
        return product.activate && product.display;
      })
      .sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
      .slice(0, 5);

    return {
      props: {
        highlightCollection: JSON.parse(JSON.stringify(highlightCollection)),
        newItems: JSON.parse(JSON.stringify(newItems)),
        cheapestItems: JSON.parse(JSON.stringify(cheapestItems)),
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
