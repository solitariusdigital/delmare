import { useEffect, useContext } from "react";
import { StateContext } from "../context/stateContext";

import LandingPage from "../components/LandingPage";
import dbConnect from "../services/dbConnect";
import User from "../models/User";
import Product from "../models/Product";

function HomePage({ users, products }) {
  const { bar, setBar } = useContext(StateContext);
  const { appUsers, setAppUsers } = useContext(StateContext);
  const { productsCollection, setProductsCollection } =
    useContext(StateContext);

  useEffect(() => {
    setAppUsers(users);
    setProductsCollection(products);
    console.log(products);
    setBar(false);
  }, [setBar, setAppUsers, users, setProductsCollection, products]);

  return <LandingPage></LandingPage>;
}

// to fetch all available data from db
export async function getServerSideProps(context) {
  try {
    await dbConnect();
    const users = await User.find();
    const products = await Product.find();

    return {
      props: {
        users: JSON.parse(JSON.stringify(users)),
        products: JSON.parse(JSON.stringify(products)),
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}

export default HomePage;
