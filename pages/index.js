import { useState, useContext, useEffect, Fragment } from "react";
import Head from "next/head";
import { StateContext } from "../context/stateContext";
import Router from "next/router";

export default function HomePage() {
  const { bar, setBar } = useContext(StateContext);

  useEffect(() => {
    setBar(false);
  }, [setBar]);

  return (
    <Fragment>
      <Head>
        <title>Delmareh</title>
      </Head>
      <button
        className="mainButton"
        onClick={() => Router.push(`/collections/clothing`)}
      >
        Clothes
      </button>
      <button
        className="mainButton"
        onClick={() => Router.push(`/collections/caring`)}
      >
        Care
      </button>
    </Fragment>
  );
}
