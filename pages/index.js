import { useEffect, useContext, Fragment } from "react";
import { StateContext } from "../context/stateContext";

import LandingPage from "../components/LandingPage";

function HomePage() {
  const { bar, setBar } = useContext(StateContext);

  useEffect(() => {
    setBar(false);
  }, [setBar]);

  return <LandingPage></LandingPage>;
}

export default HomePage;
