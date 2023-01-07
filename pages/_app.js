import Layout from "../components/Layout";
import { StateProvider } from "../context/stateContext";
import "../styles/globals.scss";

function MyApp({ Component, pageProps }) {
  return (
    <StateProvider>
      <p>yoyoy</p>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </StateProvider>
  );
}

export default MyApp;
