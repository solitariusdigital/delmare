import { useEffect, useState, Fragment } from "react";
import { useRouter } from "next/router";
import Collection from "../../../components/Collection";
import { getBrandApi } from "../../../services/api";
import Head from "next/head";
import dbConnect from "../../../services/dbConnect";
import BrandModel from "../../../models/Brand";
import Product from "../../../models/Product";

export default function Brand({ products, brands }) {
  const [gallery, setGallery] = useState([]);
  const [brand, setBrand] = useState([]);

  const router = useRouter();
  let brandDelmareId = router.query.brand;

  useEffect(() => {
    const fetchData = async () => {
      if (brandDelmareId) {
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
  }, [brandDelmareId, brands, products]);

  return (
    <Fragment>
      <Head>
        <title>Fashion Brands</title>
        <meta name="description" content="Fashion brands" />
      </Head>
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
