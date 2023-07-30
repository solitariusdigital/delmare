import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { StateProvider } from "../context/stateContext";
import Router from "next/router";
import { getNotificationsApi } from "../services/api";
import loadingImage from "../assets/loaderUpdate.png";
import Image from "next/image";
import logo from "../assets/logo.svg";
import secureLocalStorage from "react-secure-storage";
import { DefaultSeo } from "next-seo";
import "../styles/globals.scss";

export default function App({ Component, pageProps }) {
  const [loadAppUpdate, setLoadUpdate] = useState({});

  const handleRefresh = async () => {
    Router.reload();
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getNotificationsApi();
      setLoadUpdate(data[0].update);
    };
    fetchData().catch(console.error);
  }, []);

  return (
    <StateProvider>
      {(JSON.parse(secureLocalStorage.getItem("currentUser")) &&
        JSON.parse(secureLocalStorage.getItem("currentUser"))["permission"] ===
          "admin") ||
      loadAppUpdate.active ? (
        <Layout>
          <DefaultSeo
            title="با دلماره متفاوت دیده شوید"
            description="خرید امن و راحت از بهترین برندهای ایران و دنیا"
            openGraph={{
              type: "website",
              locale: "fa_IR",
              url: "https://delmareh.com/",
              siteName: "Delmareh",
            }}
          />
          <Component {...pageProps} />
        </Layout>
      ) : (
        <div className="loadAppUpdate">
          <Image width={120} height={120} src={loadingImage} alt="isLoading" />
          <p>{loadAppUpdate.text}</p>
          <Image width={90} height={140} src={logo} alt="logo" />
        </div>
      )}
    </StateProvider>
  );
}
