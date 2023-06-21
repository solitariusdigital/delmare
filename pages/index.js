import { Fragment } from "react";
import Head from "next/head";
import CollectionsPage from "../pages/collections/index";
import dbConnect from "../services/dbConnect";
import productModel from "../models/Product";

export default function HomePage({ highlightCollection, newItems }) {
  return (
    <Fragment>
      <Head>
        <title>Delmareh</title>
      </Head>
      <CollectionsPage
        highlightCollection={highlightCollection}
        newItems={newItems}
      ></CollectionsPage>
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
        return product.activate && product.season === "بهار";
      })
      .sort((a, b) => {
        return b.views - a.views;
      })
      .slice(0, 5);
    const newItems = products.reverse().slice(0, 5);

    return {
      props: {
        highlightCollection: JSON.parse(JSON.stringify(highlightCollection)),
        newItems: JSON.parse(JSON.stringify(newItems)),
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
