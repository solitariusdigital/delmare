import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { StateProvider } from "../context/stateContext";
import "../styles/globals.scss";

export default function App({ Component, pageProps }) {
  const [countryCode, setCountryCode] = useState("");

  useEffect(() => {
    const fetchIP = async () => {
      const ipInfo = await fetch("https://api.db-ip.com/v2/free/self", {
        method: "GET",
      })
        .then((res) => res.json())
        .catch((error) => console.error(error));
      setCountryCode(ipInfo.countryCode);
    };
    fetchIP();
  }, []);

  return (
    <StateProvider>
      {countryCode === "IR" ? (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      ) : (
        <div className={"landing-message"}>
          <div className={"content"}>
            <p className={"vpm"}>را خاموش کنید VPN لطفا</p>
            <p>سپس روی دکمه زیر کلیک کنید</p>
            <button
              className="mainButton"
              onClick={() => window.open("https://delmareh.com", "_ blank")}
            >
              وارد دلماره شوید
            </button>
          </div>
        </div>
      )}
    </StateProvider>
  );
}
