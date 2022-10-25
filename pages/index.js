import { useEffect, useContext } from "react";
import { StateContext } from "../context/stateContext";

import LandingPage from "../components/LandingPage";
import dbConnect from "../services/dbConnect";
import User from "../models/User";

function HomePage({ users }) {
  console.log(users);

  const { bar, setBar } = useContext(StateContext);

  useEffect(() => {
    setBar(false);
  }, [setBar]);

  return <LandingPage></LandingPage>;
}

export async function getServerSideProps(context) {
  try {
    await dbConnect();
    const users = await User.find();

    return {
      props: {
        users: JSON.parse(JSON.stringify(users)),
      },
    };
  } catch (err) {
    res.status(500).json(err);
  }
}

export default HomePage;
