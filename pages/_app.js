import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { StateProvider } from "../context/stateContext";
import PullToRefresh from "react-simple-pull-to-refresh";
import Router from "next/router";
import "../styles/globals.scss";
import { getNotificationsApi } from "../services/api";
import loadingImage from "../assets/loaderUpdate.png";
import Image from "next/image";
import logo from "../assets/logo.svg";

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
      {!loadAppUpdate.active ? (
        <Layout>
          <PullToRefresh
            onRefresh={handleRefresh}
            pullingContent={false}
            refreshingContent={false}
          >
            <Component {...pageProps} />
          </PullToRefresh>
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
