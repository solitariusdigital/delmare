import { useEffect, useContext } from "react";
import { StateContext } from "../context/stateContext";

function NewPage() {
  const { bar, setBar } = useContext(StateContext);

  useEffect(() => {
    setBar(true);
  }, [setBar]);

  return <p>The new page</p>;
}

export default NewPage;
