import { Fragment } from "react";
import Head from "next/head";
import LandingPage from "../components/LandingPage";

function HomePage() {
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
