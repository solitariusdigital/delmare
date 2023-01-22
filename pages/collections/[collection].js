import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { StateContext } from "../../context/stateContext";
import { Fragment } from "react";
import Brands from "../../components/Brands";
import Bloggers from "../../components/Bloggers";
import Collection from "../../components/Collection";
import Head from "next/head";
import Product from "../../models/Product";
import dbConnect from "../../services/dbConnect";

export default function CollectionPage({ products, data }) {
  const { productsCollection, setProductsCollection } =
    useContext(StateContext);
  const { saleCollection, setSaleCollection } = useContext(StateContext);
  const { galleryCollection, setGalleryCollection } = useContext(StateContext);
  const { accessoriesCollection, setAccessoriesCollection } =
    useContext(StateContext);

  const router = useRouter();
  let collection = router.query.collection;

  useEffect(() => {
    const fetchData = async () => {
      setProductsCollection(products);
      switch (collection) {
        case "gallery":
          setGalleryCollection(data);
          break;
        case "sale":
          setSaleCollection(data);
          break;
        case "accessories":
          setAccessoriesCollection(data);
          break;
      }
    };
    fetchData().catch(console.error);
  }, [
    setProductsCollection,
    setSaleCollection,
    setGalleryCollection,
    setAccessoriesCollection,
    collection,
    products,
    data,
  ]);

  return (
    <Fragment>
      <Head>
        <title>Fashion Clothing</title>
        <meta name="description" content="Fashion clothing" />
      </Head>
      {collection === "gallery" && <Collection collectionType={collection} />}
      {collection === "sale" && <Collection collectionType={collection} />}
      {collection === "accessories" && (
        <Collection collectionType={collection} />
      )}
      {collection === "brands" && <Brands />}
      {collection === "bloggers" && <Bloggers />}
    </Fragment>
  );
}

// initial connection to db
export async function getServerSideProps(context) {
  try {
    await dbConnect();
    const products = await Product.find();
    let data = null;
    switch (context.params.collection) {
      case "gallery":
        data = products.filter((product) => {
          return !product.sale;
        });
        break;
      case "sale":
        data = products.filter((product) => {
          return product.sale;
        });
        break;
      case "accessories":
        data = products.filter((product) => {
          return (
            product.category === "اکسسوری" ||
            product.category === "ساعت" ||
            product.category === "عینک" ||
            product.category === "کلاه" ||
            product.category === "کیف"
          );
        });
        break;
    }
    return {
      props: {
        products: JSON.parse(JSON.stringify(products)),
        data: JSON.parse(JSON.stringify(data)),
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
