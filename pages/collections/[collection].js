import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { StateContext } from "../../context/stateContext";
import { Fragment } from "react";
import Brands from "../../components/Brands";
import Collection from "../../components/Collection";
import { getProducstApi } from "../../services/api";

function CollectionPage() {
  const { productsCollection, setProductsCollection } =
    useContext(StateContext);
  const { saleCollection, setSaleCollection } = useContext(StateContext);
  const { galleryCollection, setGalleryCollection } = useContext(StateContext);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProducstApi();
      setProductsCollection(data);
      setSaleCollection(
        data.filter((product) => {
          return product.sale;
        })
      );
      setGalleryCollection(
        data.filter((product) => {
          return !product.sale;
        })
      );
    };
    fetchData().catch(console.error);
  }, [setProductsCollection, setSaleCollection, setGalleryCollection]);

  const router = useRouter();
  let collection = router.query.collection;

  return (
    <Fragment>
      {collection == "gallery" && <Collection collectionType={"gallery"} />}
      {collection == "sale" && <Collection collectionType={"sale"} />}
      {collection == "brands" && <Brands />}
    </Fragment>
  );
}

export default CollectionPage;
