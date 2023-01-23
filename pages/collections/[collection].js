import { useRouter } from "next/router";
import { Fragment } from "react";
import Brands from "../../components/Brands";
import Bloggers from "../../components/Bloggers";
import Collection from "../../components/Collection";
import Head from "next/head";
import dbConnect from "../../services/dbConnect";
import Product from "../../models/Product";
import Brand from "../../models/Brand";

export default function CollectionPage({ products, brands }) {
  const router = useRouter();
  let collection = router.query.collection;

  return (
    <Fragment>
      <Head>
        <title>Fashion Clothing</title>
        <meta name="description" content="Fashion clothing" />
      </Head>
      {collection === "gallery" && (
        <Collection collectionType={collection} galleryData={products} />
      )}
      {collection === "sale" && (
        <Collection collectionType={collection} galleryData={products} />
      )}
      {collection === "accessories" && (
        <Collection collectionType={collection} galleryData={products} />
      )}
      {collection === "brands" && <Brands brandsData={brands} />}
      {collection === "bloggers" && <Bloggers />}
    </Fragment>
  );
}

// initial connection to db
export async function getServerSideProps(context) {
  try {
    await dbConnect();
    let products = null;
    let brands = null;

    switch (context.params.collection) {
      case "gallery":
        products = await Product.find({ sale: false });
        break;
      case "sale":
        products = await Product.find({ sale: true });
        break;
      case "accessories":
        products = await Product.find();
        products = products.filter((product) => {
          return (
            product.category === "اکسسوری" ||
            product.category === "ساعت" ||
            product.category === "عینک" ||
            product.category === "کلاه" ||
            product.category === "کیف"
          );
        });
        break;
      case "brands":
        brands = await Brand.find();
        break;
    }
    return {
      props: {
        products: JSON.parse(JSON.stringify(products)),
        brands: JSON.parse(JSON.stringify(brands)),
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
