import { useState, useContext, useEffect, Fragment } from "react";
import Head from "next/head";
import { StateContext } from "../context/stateContext";
import Router from "next/router";

export default function HomePage() {
  const { bar, setBar } = useContext(StateContext);
  const { userLogIn, setUserLogin } = useContext(StateContext);
  const { toggleContainer, setToggleContainer } = useContext(StateContext);
  const { register, setRegister } = useContext(StateContext);
  const { menu, setMenu } = useContext(StateContext);

  useEffect(() => {
    document.body.style.background = "#f9f7f2";
    setBar(false);
  }, [setBar]);

  useEffect(() => {
    if (!window.matchMedia("(display-mode: standalone)").matches) {
      setToggleContainer("screen");
    }
  }, [setToggleContainer]);

  const loginAction = () => {
    setToggleContainer("");
    setMenu(true);
    setRegister(true);
  };

  return (
    <Fragment>
      <Head>
        <title>Delmareh</title>
      </Head>
      {!userLogIn && (
        <div onClick={() => loginAction()} className="ctaButton">
          <p>ورود / ​ثبت نام</p>
        </div>
      )}
      <button
        className="mainButton"
        onClick={() => Router.push(`/collections/clothing`)}
      >
        Clothes
      </button>
      <button
        className="mainButton"
        onClick={() => Router.push(`/collections/care`)}
      >
        Care
      </button>
    </Fragment>
  );
}
