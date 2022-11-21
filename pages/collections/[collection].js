import { useRouter } from "next/router";
import { Fragment } from "react";
import Gallery from "../../components/collections/Gallery";
import Brands from "../../components/collections/Brands";
import Sale from "../../components/collections/Sale";

function CollectionPage() {
  const router = useRouter();
  let collection = router.query.collection;

  return (
    <Fragment>
      {collection == "gallery" && <Gallery />}
      {collection == "sale" && <Sale />}
      {collection == "brands" && <Brands />}
    </Fragment>
  );
}

export default CollectionPage;
