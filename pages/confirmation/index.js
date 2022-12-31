import { useEffect, useContext, useState, Fragment } from "react";
import { StateContext } from "../../context/stateContext";
import Router from "next/router";
import { postMellatApi } from "../../services/api";
import classes from "../page.module.scss";
import CancelIcon from "@mui/icons-material/Cancel";
import qs from "querystring";

export default function Confimation({ props }) {
  const { toggleContainer, setToggleContainer } = useContext(StateContext);
  const { container, setContainer } = useContext(StateContext);
  const [displayReject, setDisplayReject] = useState(false);

  useEffect(() => {
    setContainer(false);
  }, [setContainer]);

  useEffect(() => {
    const fetchData = async () => {
      if (props.ResCode === "0") {
        let check = await postMellatApi(props);
        if (check.code === 200) {
          localStorage.setItem("refId", JSON.stringify(check.refId));
          Router.push(`/confirmation/${check.refId}`);
        } else {
          setDisplayReject(true);
        }
      } else {
        setDisplayReject(true);
      }
    };
    fetchData().catch(console.error);
  }, [props.ResCode, props]);

  return (
    <Fragment>
      {displayReject && (
        <div className={classes.rejectContainer}>
          <CancelIcon sx={{ color: "#d40d12", fontSize: 50 }} />
          <p className={classes.rejectMsg}>پرداخت نا موفق</p>
          <p>خطا در انجام تراکنش</p>
          <button
            className="mainButton"
            onClick={() => {
              Router.push("/");
              setTimeout(() => {
                setToggleContainer("cart");
              }, 200);
            }}
          >
            ادامه خرید
          </button>
        </div>
      )}
    </Fragment>
  );
}

export async function getServerSideProps(context) {
  const props = {
    SaleReferenceId: "",
    ResCode: "",
    SaleOrderId: "",
  };
  const { req } = context;

  const streamPromise = new Promise((resolve, reject) => {
    let postBody = "";

    req.on("data", (data) => {
      postBody += data.toString();
    });

    req.on("end", () => {
      const postData = qs.parse(postBody);
      resolve(postData);
    });
  });

  try {
    const { SaleReferenceId, ResCode, SaleOrderId } = await streamPromise;
    props.SaleReferenceId = SaleReferenceId;
    props.ResCode = ResCode;
    props.SaleOrderId = SaleOrderId;

    return {
      props: {
        props: JSON.parse(JSON.stringify(props)),
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
