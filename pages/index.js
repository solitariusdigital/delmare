/* eslint-disable @next/next/no-page-custom-font */
import { useEffect, useContext, Fragment } from "react";
import { StateContext } from "../context/stateContext";
import Head from "next/head";
import LandingPage from "../components/LandingPage";
import dbConnect from "../services/dbConnect";
import User from "../models/User";

function HomePage({ users, products, galleryProducts, saleProducts }) {
  const { bar, setBar } = useContext(StateContext);
  const { appUsers, setAppUsers } = useContext(StateContext);

  useEffect(() => {
    setAppUsers(users);
    setBar(false);
  }, [setBar, setAppUsers, users]);

  return (
    <Fragment>
      <Head>
        <title>Delmareh</title>
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

    return {
      props: {
        users: JSON.parse(JSON.stringify(users)),
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}

export default HomePage;
