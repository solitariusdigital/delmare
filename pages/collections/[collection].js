import { useRouter } from "next/router";
import { Fragment } from "react";
import New from "../../components/collections/New";
import Brands from "../../components/collections/Brands";
import Bloggers from "../../components/collections/Bloggers";

function CollectionPage() {
  const router = useRouter();
  let collection = router.query.collection;

  return (
    <Fragment>
      {collection == "new" && <New />}
      {collection == "brands" && <Brands />}
      {collection == "bloggers" && <Bloggers />}
    </Fragment>
  );
}

export default CollectionPage;
