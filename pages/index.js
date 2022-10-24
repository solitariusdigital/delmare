import { useEffect, useContext } from "react";
import { StateContext } from "../context/stateContext";

import LandingPage from "../components/LandingPage";

function HomePage({ users }) {
  console.log(users);

  const { bar, setBar } = useContext(StateContext);

  useEffect(() => {
    setBar(false);
  }, [setBar]);

  return <LandingPage></LandingPage>;
}

export async function getServerSideProps(context) {
  let URL = null;
  if (process.env.NODE_ENV == "development") {
    URL = process.env.NEXT_PUBLIC_URL;
  } else if (process.env.NODE_ENV == "production") {
    URL = process.env.NEXT_PUBLIC_URL_PRO;
  }

  let res = await fetch(`${URL}/api/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let users = await res.json();
  return {
    props: { users },
  };
}

export default HomePage;
