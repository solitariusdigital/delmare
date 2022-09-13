import { useEffect, useContext } from "react";
import { StateContext } from "../context/stateContext";

function NewPage() {
  const { bar, setBar } = useContext(StateContext);

  useEffect(() => {
    setBar(true);
  }, [setBar]);

  return <h1>The new page</h1>;
}

export default NewPage;
