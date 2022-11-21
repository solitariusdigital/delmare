import { useRouter } from "next/router";
import { Fragment } from "react";
import Brands from "../../components/Brands";
import Collection from "../../components/Collection";

function CollectionPage() {
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
