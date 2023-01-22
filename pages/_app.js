import Layout from "../components/Layout";
import { StateProvider } from "../context/stateContext";
import PullToRefresh from "react-simple-pull-to-refresh";
import Router from "next/router";
import "../styles/globals.scss";

export default function App({ Component, pageProps }) {
  const handleRefresh = async () => {
    Router.reload();
  };

  return (
    <StateProvider>
      <Layout>
        <PullToRefresh
          onRefresh={handleRefresh}
          pullingContent={false}
          refreshingContent={false}
        >
          <Component {...pageProps} />
        </PullToRefresh>
      </Layout>
    </StateProvider>
  );
}
