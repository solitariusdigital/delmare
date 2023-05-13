import { Fragment, useContext } from "react";
import { StateContext } from "../../context/stateContext";
import Router from "next/router";
import Image from "next/image";
import Head from "next/head";
import sale from "../../assets/sale.png";
import Highlight from "../../components/Highlight";
import dbConnect from "../../services/dbConnect";
import productModel from "../../models/Product";

export default function CollectionsPage({
  springCollection,
  summerCollection,
}) {
  const { navigation, setNavigation } = useContext(StateContext);
  const sourceLink = `https://delmare.storage.iran.liara.space/landingpage/`;

  const collections = [
    {
      title: "گالری",
      link: "/collections/gallery",
      imageSrc: `${sourceLink}one.jpg`,
    },
    {
      title: "تخفیف",
      link: "/collections/sale",
      imageSrc: `${sourceLink}three.jpg`,
    },
    {
      title: "اکسسوری",
      link: "/collections/accessories",
      imageSrc: `${sourceLink}accessories.jpg`,
    },
    {
      title: "کفش",
      link: "/collections/shoes",
      imageSrc: `${sourceLink}shoes.jpg`,
    },
    {
      title: "بلاگرز",
      link: "/collections/bloggers",
      imageSrc: `${sourceLink}four.jpg`,
    },
    {
      title: "برندز",
      link: "/collections/brands",
      imageSrc: `${sourceLink}ten.jpg`,
    },
  ];

  const activateNav = (link, index) => {
    navigation.forEach((nav, i) => {
      if (i === index) {
        Router.push(`${link}`);
        nav.active = true;
      } else {
        nav.active = false;
      }
    });
    setNavigation([...navigation]);
  };

  return (
    <Fragment>
      <Head>
        <title>Collections</title>
        <meta name="description" content="Select from Delmareh's collections" />
      </Head>
      <div className="highlight">
        <h3>بیشترین بازدید</h3>
        <p>کالکشن بهار</p>
        <Highlight products={springCollection} />
        <p>کالکشن تابستان</p>
        <Highlight products={summerCollection} />
      </div>
      <div className="collections-type">
        {collections.map((collection, index) => (
          <div
            key={index}
            className="card"
            onClick={() => activateNav(collection.link, index)}
          >
            <div className="banner">
              <p>{collection.title}</p>
            </div>
            {collection.title === "تخفیف" && (
              <div className="sale">
                <Image
                  src={sale}
                  alt="sale"
                  objectFit="contain"
                  width={70}
                  height={70}
                />
              </div>
            )}
            <Image
              className={"image"}
              src={collection.imageSrc}
              blurDataURL={collection.imageSrc}
              placeholder="blur"
              alt="image"
              layout="fill"
              objectFit="cover"
              priority
              loading="eager"
            />
          </div>
        ))}
      </div>
    </Fragment>
  );
}

// initial connection to db
export async function getServerSideProps(context) {
  try {
    await dbConnect();
    const products = await productModel.find();
    const springCollection = products
      .filter((product) => {
        return product.activate && product.season === "بهار";
      })
      .sort((a, b) => {
        return b.views - a.views;
      })
      .slice(0, 6);
    const summerCollection = products
      .filter((product) => {
        return product.activate && product.season === "تابستان";
      })
      .sort((a, b) => {
        return b.views - a.views;
      })
      .slice(0, 6);

    return {
      props: {
        springCollection: JSON.parse(JSON.stringify(springCollection)),
        summerCollection: JSON.parse(JSON.stringify(summerCollection)),
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
