import { useEffect, useContext } from "react";
import { StateContext } from "../context/stateContext";

import LandingPage from "../components/LandingPage";
import dbConnect from "../services/dbConnect";
import User from "../models/User";

function HomePage({ users }) {
  const { bar, setBar } = useContext(StateContext);
  const { appUsers, setAppUsers } = useContext(StateContext);

  useEffect(() => {
    setAppUsers(users);
    setBar(false);
  }, [setBar, setAppUsers, users]);

  return <LandingPage></LandingPage>;
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
    console.log(error);
    return {
      notFound: true,
    };
  }
}

export default HomePage;
