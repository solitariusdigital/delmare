import Layout from "../components/Layout";
import { StateProvider } from "../context/stateContext";
import "../styles/globals.scss";

export default function App({ Component, pageProps }) {
  return (
    <StateProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </StateProvider>
  );
}
