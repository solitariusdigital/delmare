import Layout from "../components/Layout";
import { StateProvider } from "../context/stateContext";
import { DefaultSeo } from "next-seo";
import "../styles/globals.scss";

export default function App({ Component, pageProps }) {
  return (
    <StateProvider>
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
    </StateProvider>
  );
}
