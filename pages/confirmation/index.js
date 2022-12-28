import { useEffect, useContext } from "react";
import { StateContext } from "../../context/stateContext";
import Router from "next/router";

export default function Confimation() {
  const { container, setContainer } = useContext(StateContext);

  useEffect(() => {
    setContainer(false);
    Router.push(`/confirmation/${JSON.parse(localStorage.getItem("refId"))}}`);
  }, [setContainer]);

  return;
}
