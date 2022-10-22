import { useRouter } from "next/router";
import { Fragment } from "react";
import New from "../../components/collections/NewCollection";
import Brands from "../../components/collections/BrandsCollection";
import Bloggers from "../../components/collections/BloggersCollection";

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
