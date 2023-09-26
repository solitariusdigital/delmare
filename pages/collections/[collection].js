import { Fragment, useContext, useEffect } from "react";
import { StateContext } from "../../context/stateContext";
import { useRouter } from "next/router";
import Brands from "../../components/Brands";
import Bloggers from "../../components/Bloggers";
import Collection from "../../components/Collection";
import dbConnect from "../../services/dbConnect";
import ProductModel from "../../models/Product";
import Brand from "../../models/Brand";
import Blogger from "../../models/Blogger";

import Care from "../../models/Care";
import { NextSeo } from "next-seo";

export default function CollectionPage({
  products,
  careProducts,
  brands,
  bloggers,
}) {
  const router = useRouter();
  let collection = router.query.collection;
  const { navigationTopBar, setNavigationTopBar } = useContext(StateContext);

  useEffect(() => {
    navigationTopBar.map((nav, i) => {
      if (nav.collection === collection) {
        nav.active = true;
      } else {
        nav.active = false;
      }
    });
    setNavigationTopBar([...navigationTopBar]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <NextSeo
        title="Delmreh دلماره"
        description="خرید امن و راحت از بهترین برندهای ایران و دنیا"
        openGraph={{
          siteName: "Delmareh",
          title: "دلماره",
          url: "https://delmareh.com/",
          type: "website",
          locale: "fa_IR",
        }}
      />
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

    // await UserModel.updateMany({}, { $set: { loyalty: 0 } });

    switch (collection) {
      case "gallery":
        products = await ProductModel.find({ sale: false });
        break;
      case "sale":
        let data = await ProductModel.find({ sale: true });
        products = data.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        break;
      case "accessories":
        products = await ProductModel.find({
          category: { $in: ["اکسسوری", "ساعت", "عینک", "کلاه", "کیف"] },
        });
        break;
      case "shoes":
        products = await ProductModel.find({ category: "کفش" });
        break;
      case "brands":
        brands = await Brand.find();
        break;
      case "bloggers":
        bloggers = await Blogger.find();
        break;
      case "skin":
        careProducts = await Care.find({
          category: { $in: ["مراقبت صورت"] },
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
