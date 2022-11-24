import { useEffect, useContext, useState, Fragment } from "react";
import { useRouter } from "next/router";
import Collection from "../../../components/Collection";
import { getBrandApi } from "../../../services/api";
import { StateContext } from "../../../context/stateContext";

export default function Brand() {
  const { productsCollection, setProductsCollection } =
    useContext(StateContext);
  const [gallery, setGallery] = useState([]);
  const [brand, setBrand] = useState([]);

  const router = useRouter();
  let brandId = router.query.brand;

  useEffect(() => {
    const fetchData = async () => {
      const brand = await getBrandApi(brandId);
      setBrand(brand);
      setGallery(
        productsCollection.filter((product) => {
          return brand.products.includes(product["_id"]);
        })
      );
    };
    fetchData().catch(console.error);
  }, [brandId, productsCollection]);

  return (
    <Fragment>
      <Collection
        collectionType={"brand"}
        brandGallery={gallery}
        brand={brand}
      />
    </Fragment>
  );
}
