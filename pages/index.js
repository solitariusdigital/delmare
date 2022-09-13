import { useEffect, useContext } from "react";
import { StateContext } from "../context/stateContext";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import Router from "next/router";

function HomePage() {
  const { bar, setBar } = useContext(StateContext);

  useEffect(() => {
    setBar(false);
  }, [setBar]);

  return (
    <ExpandCircleDownIcon
      fontSize="large"
      sx={{ color: "#1b1b1b" }}
      onClick={() => Router.push("/new")}
    />
  );
}

export default HomePage;
