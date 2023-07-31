import { useEffect, useState, Fragment } from "react";
import { useRouter } from "next/router";
import Collection from "../../../components/Collection";
import { getBrandApi } from "../../../services/api";
import dbConnect from "../../../services/dbConnect";
import BrandModel from "../../../models/Brand";
import Product from "../../../models/Product";
import { NextSeo } from "next-seo";

export default function Brand({ products, brands }) {
  const [gallery, setGallery] = useState([]);
  const [brand, setBrand] = useState([]);

  const router = useRouter();
  let brandDelmareId = router.query.brand;

  useEffect(() => {
    const setBrandData = async (brand) => {
      if (brand.delmareId === brandDelmareId.toUpperCase()) {
        const brandData = await getBrandApi(brand["_id"]);
        setBrand(brandData);
        setGallery(
          products.filter((product) => {
            return brandData.products.includes(product["_id"]);
          })
        );
      }
    };
    if (brandDelmareId) {
      brands.forEach((brand) => {
        setBrandData(brand);
      });
    }
  }, [brandDelmareId, brands, products]);

  return (
    <Fragment>
      <NextSeo
        title="برندز"
        description="برندز همکار در دلماره"
        openGraph={{
          type: "website",
          locale: "fa_IR",
          url: "https://delmareh.com/collections/brands",
          siteName: "Delmareh",
        }}
      />
      <Collection
        collectionType={"brands"}
        brandGallery={gallery}
        brand={brand}
      />
    </Fragment>
  );
}

// initial connection to db
export async function getServerSideProps(context) {
  try {
    await dbConnect();
    const brands = await BrandModel.find();
    const products = await Product.find();

    return {
      props: {
        brands: JSON.parse(JSON.stringify(brands)),
        products: JSON.parse(JSON.stringify(products)),
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
