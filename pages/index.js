/* eslint-disable @next/next/no-page-custom-font */
import { useEffect, useContext, Fragment } from "react";
import { StateContext } from "../context/stateContext";
import Head from "next/head";
import LandingPage from "../components/LandingPage";

function HomePage() {
  const { bar, setBar } = useContext(StateContext);

  useEffect(() => {
    setBar(false);
  }, [setBar]);

  return (
    <Fragment>
      <Head>
        <title>Delmareh</title>
      </Head>
      <LandingPage></LandingPage>
    </Fragment>
  );
}

export default HomePage;
