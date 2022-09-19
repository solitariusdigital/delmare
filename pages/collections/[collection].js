import { useRouter } from "next/router";

function CollectionPage() {
  const router = useRouter();
  let collection = router.query.collection;

  return <p>{collection}</p>;
}

export default CollectionPage;
