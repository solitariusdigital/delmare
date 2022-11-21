import { useEffect, useContext } from "react";
import { StateContext } from "../context/stateContext";

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

  return <LandingPage></LandingPage>;
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
