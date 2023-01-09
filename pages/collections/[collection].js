import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { StateContext } from "../../context/stateContext";
import { Fragment } from "react";
import Brands from "../../components/Brands";
import Collection from "../../components/Collection";
import { getProducstApi } from "../../services/api";
import Head from "next/head";

function CollectionPage() {
  const { productsCollection, setProductsCollection } =
    useContext(StateContext);
  const { saleCollection, setSaleCollection } = useContext(StateContext);
  const { galleryCollection, setGalleryCollection } = useContext(StateContext);
  const { accessoriesCollection, setAccessoriesCollection } =
    useContext(StateContext);
  const { searchControl, setSearchControl } = useContext(StateContext);

  const router = useRouter();
  let collection = router.query.collection;

  useEffect(() => {
    setSearchControl(true);

    const fetchData = async () => {
      const data = await getProducstApi();
      setProductsCollection(data);
      setGalleryCollection(
        data.filter((product) => {
          return !product.sale;
        })
      );
      setSaleCollection(
        data.filter((product) => {
          return product.sale;
        })
      );
      setAccessoriesCollection(
        data.filter((product) => {
          return (
            product.category === "اکسسوری" ||
            product.category === "ساعت" ||
            product.category === "عینک" ||
            product.category === "کلاه" ||
            product.category === "کیف"
          );
        })
      );
    };
    fetchData().catch(console.error);
  }, [
    setProductsCollection,
    setSaleCollection,
    setGalleryCollection,
    setAccessoriesCollection,
    setSearchControl,
  ]);

  return (
    <Fragment>
      <Head>
        <title>Fashion Clothing</title>
        <meta name="description" content="Fashion clothing" />
      </Head>
      {collection == "gallery" && <Collection collectionType={"gallery"} />}
      {collection == "sale" && <Collection collectionType={"sale"} />}
      {collection == "accessories" && (
        <Collection collectionType={"accessories"} />
      )}
      {collection == "brands" && <Brands />}
    </Fragment>
  );
}

export default CollectionPage;
