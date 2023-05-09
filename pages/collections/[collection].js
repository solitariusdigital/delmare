import { useRouter } from "next/router";
import { Fragment } from "react";
import Brands from "../../components/Brands";
import Bloggers from "../../components/Bloggers";
import Collection from "../../components/Collection";
import Head from "next/head";
import dbConnect from "../../services/dbConnect";
import Product from "../../models/Product";
import Brand from "../../models/Brand";
import Blogger from "../../models/Blogger";

export default function CollectionPage({ products, brands, bloggers }) {
  const router = useRouter();
  let collection = router.query.collection;

  return (
    <Fragment>
      <Head>
        <title>Fashion Clothing</title>
        <meta name="description" content="Fashion clothing" />
      </Head>
      {["gallery", "sale", "accessories", "shoes"].includes(collection) && (
        <Collection collectionType={collection} galleryData={products} />
      )}
      {collection === "brands" && <Brands brandsData={brands} />}
      {collection === "bloggers" && <Bloggers bloggersData={bloggers} />}
    </Fragment>
  );
}

// initial connection to db
export async function getServerSideProps(context) {
  try {
    await dbConnect();

    let products = null;
    let brands = null;
    let bloggers = null;

    const { collection } = context.params;

    switch (collection) {
      case "gallery":
        products = await Product.find({ sale: false });
        break;
      case "sale":
        products = await Product.find({ sale: true });
        break;
      case "accessories":
        products = await Product.find({
          category: { $in: ["اکسسوری", "ساعت", "عینک", "کلاه", "کیف"] },
        });
        break;
      case "shoes":
        products = await Product.find({ category: "کفش" });
        break;
      case "brands":
        brands = await Brand.find();
        break;
      case "bloggers":
        bloggers = await Blogger.find();
        break;
    }

    return {
      props: {
        products: JSON.parse(JSON.stringify(products)),
        brands: JSON.parse(JSON.stringify(brands)),
        bloggers: JSON.parse(JSON.stringify(bloggers)),
      },
    };
  } catch (error) {
    console.error(error);

    return {
      notFound: true,
    };
  }
}
