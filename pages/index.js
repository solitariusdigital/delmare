/* eslint-disable @next/next/no-page-custom-font */
import { useEffect, useContext, Fragment } from "react";
import { StateContext } from "../context/stateContext";
import Head from "next/head";
import LandingPage from "../components/LandingPage";
import dbConnect from "../services/dbConnect";
import User from "../models/User";
import Product from "../models/Product";

function HomePage({ users, products, galleryProducts, saleProducts }) {
  const { bar, setBar } = useContext(StateContext);
  const { appUsers, setAppUsers } = useContext(StateContext);
  const { productsCollection, setProductsCollection } =
    useContext(StateContext);
  const { saleCollection, setSaleCollection } = useContext(StateContext);
  const { galleryCollection, setGalleryCollection } = useContext(StateContext);

  useEffect(() => {
    setAppUsers(users);
    setProductsCollection(products);
    setGalleryCollection(galleryProducts);
    setSaleCollection(saleProducts);
    setBar(false);
  }, [
    setBar,
    setAppUsers,
    users,
    setProductsCollection,
    products,
    setSaleCollection,
    saleProducts,
    setGalleryCollection,
    galleryProducts,
  ]);

  return (
    <Fragment>
      <Head>
        <title>Delmareh</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;500&display=swap"
          rel="stylesheet"
        />
      </Head>
      <LandingPage></LandingPage>
    </Fragment>
  );
}

// to fetch all available data from db
export async function getServerSideProps(context) {
  try {
    await dbConnect();
    const users = await User.find();
    const products = await Product.find();
    const galleryProducts = products.filter((product) => {
      return !product.sale;
    });
    const saleProducts = products.filter((product) => {
      return product.sale;
    });

    return {
      props: {
        users: JSON.parse(JSON.stringify(users)),
        products: JSON.parse(JSON.stringify(products)),
        galleryProducts: JSON.parse(JSON.stringify(galleryProducts)),
        saleProducts: JSON.parse(JSON.stringify(saleProducts)),
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}

export default HomePage;
