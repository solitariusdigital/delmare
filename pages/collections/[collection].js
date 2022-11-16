import { useRouter } from "next/router";
import { Fragment } from "react";
import New from "../../components/collections/New";
import Brands from "../../components/collections/Brands";

function CollectionPage() {
  const router = useRouter();
  let collection = router.query.collection;

  return (
    <Fragment>
      {collection == "new" && <New />}
      {collection == "brands" && <Brands />}
    </Fragment>
  );
}

export default CollectionPage;
