import { useContext, Fragment, useEffect, useState } from "react";
import { StateContext } from "../context/stateContext";
import { FileUpload } from "primereact/fileupload";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

function Upload() {
  const { container, setContainer } = useContext(StateContext);
  const [file, setFile] = useState(null);

  useEffect(() => {
    setContainer(false);
  }, [setContainer]);

  return (
    <Fragment>
      <FileUpload
        name="main"
        url="/api/product"
        accept="image/*"
        maxFileSize="2000000"
      ></FileUpload>
    </Fragment>
  );
}

export default Upload;
