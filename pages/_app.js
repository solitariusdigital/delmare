import Layout from "../components/layout/Layout";
import { StateProvider } from "../context/stateContext";

import "../styles/globals.scss";

function MyApp({ Component, pageProps }) {
  return (
    <StateProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </StateProvider>
  );
}

export default MyApp;
