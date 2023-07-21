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
import Care from "../../models/Care";

export default function CollectionPage({
  products,
  careProducts,
  brands,
  bloggers,
}) {
  const router = useRouter();
  let collection = router.query.collection;

  return (
    <Fragment>
      <Head>
        <title>Fashion Clothing</title>
        <meta name="description" content="Fashion clothing" />
      </Head>
      {["gallery", "sale", "accessories", "shoes"].includes(collection) && (
        <Collection collectionType={collection} collectionData={products} />
      )}
      {["hair", "skin"].includes(collection) && (
        <Collection collectionType={collection} collectionData={careProducts} />
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
    let careProducts = null;

    const { collection } = context.params;

    // await Product.updateMany({}, { $set: { group: "clothing" } });

    switch (collection) {
      case "gallery":
        products = await Product.find({ sale: false });
        break;
      case "sale":
        let data = await Product.find({ sale: true });
        products = data.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
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
      case "skin":
        careProducts = await Care.find({
          category: { $in: ["مراقبت پوست"] },
        });
        break;
      case "hair":
        careProducts = await Care.find({
          category: { $in: ["مراقبت مو"] },
        });
        break;
    }

    return {
      props: {
        products: JSON.parse(JSON.stringify(products)),
        brands: JSON.parse(JSON.stringify(brands)),
        bloggers: JSON.parse(JSON.stringify(bloggers)),
        careProducts: JSON.parse(JSON.stringify(careProducts)),
      },
    };
  } catch (error) {
    console.error(error);

    return {
      notFound: true,
    };
  }
}
