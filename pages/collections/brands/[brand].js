import { useEffect, useContext, useState, Fragment } from "react";
import { useRouter } from "next/router";
import Collection from "../../../components/Collection";
import {
  getBrandApi,
  getProducstApi,
  getBrandsApi,
} from "../../../services/api";

export default function Brand() {
  const [gallery, setGallery] = useState([]);
  const [brand, setBrand] = useState([]);

  const router = useRouter();
  let brandDelmareId = router.query.brand;

  useEffect(() => {
    const fetchData = async () => {
      if (brandDelmareId) {
        const products = await getProducstApi();
        const brands = await getBrandsApi();
        brands.forEach(async (brand) => {
          if (brand.delmareId === brandDelmareId.toUpperCase()) {
            const brandData = await getBrandApi(brand["_id"]);
            setBrand(brandData);
            setGallery(
              products.filter((product) => {
                return brandData.products.includes(product["_id"]);
              })
            );
          }
        });
      }
    };
    fetchData().catch(console.error);
  }, [brandDelmareId]);

  return (
    <Fragment>
      <Collection
        collectionType={"brands"}
        brandGallery={gallery}
        brand={brand}
      />
    </Fragment>
  );
}
