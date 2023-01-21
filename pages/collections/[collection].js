import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { StateContext } from "../../context/stateContext";
import { Fragment } from "react";
import Brands from "../../components/Brands";
import Bloggers from "../../components/Bloggers";
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
  const { navigation, setNavigation } = useContext(StateContext);

  const router = useRouter();
  let collection = router.query.collection;

  useEffect(() => {
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
  ]);

  useEffect(() => {
    navigation.map((nav) => {
      if (nav.collection === collection) {
        nav.active = true;
      } else {
        nav.active = false;
      }
    });
    setNavigation([...navigation]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection, setNavigation]);

  return (
    <Fragment>
      <Head>
        <title>Fashion Clothing</title>
        <meta name="description" content="Fashion clothing" />
      </Head>
      {collection === "gallery" && <Collection collectionType={"gallery"} />}
      {collection === "sale" && <Collection collectionType={"sale"} />}
      {collection === "accessories" && (
        <Collection collectionType={"accessories"} />
      )}
      {collection === "brands" && <Brands />}
      {collection === "bloggers" && <Bloggers />}
    </Fragment>
  );
}

export default CollectionPage;
