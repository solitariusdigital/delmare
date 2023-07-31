import { Fragment, useContext, useEffect } from "react";
import { StateContext } from "../../context/stateContext";
import Router from "next/router";
import Image from "next/image";
import Head from "next/head";
import Highlight from "../../components/Highlight";
import dbConnect from "../../services/dbConnect";
import ProductModel from "../../models/Product";

export default function Clothing({
  newItems,
  newSales,
  mostViews,
  cheapestItems,
}) {
  const { navigationTopBar, setNavigationTopBar } = useContext(StateContext);
  const { bar, setBar } = useContext(StateContext);
  const { container, setContainer } = useContext(StateContext);
  const { search, setSearch } = useContext(StateContext);
  const { searchControl, setSearchControl } = useContext(StateContext);
  const { navigationBottom, setNavigationBottom } = useContext(StateContext);
  const { toggleType, setToggleType } = useContext(StateContext);
  const sourceLink = `https://delmare.storage.iran.liara.space/landingpage/`;

  useEffect(() => {
    setBar(false);
    setContainer(true);
    setSearchControl(false);
    setSearch(false);
    setNavigationBottom(true);
    setToggleType("clothing");
  }, [
    setBar,
    setContainer,
    setNavigationBottom,
    setSearch,
    setSearchControl,
    setToggleType,
  ]);

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
    sessionStorage.removeItem("positionY");
    navigationTopBar.forEach((nav, i) => {
      if (i === index) {
        Router.push(link);
        nav.active = true;
      } else {
        nav.active = false;
      }
    });
    setNavigationTopBar([...navigationTopBar]);
  };

  return (
    <Fragment>
      <Head>
        <title>Clothing Products</title>
        <meta name="description" content="Delmareh's clothing products" />
      </Head>
      <div className="highlight">
        <h4>جدید</h4>
        <Highlight products={newItems} />
      </div>
      <div className="collections-type">
        {collections.map((collection, index) => (
          <Fragment key={index}>
            <div
              className="cardClothing"
              onClick={() => activateNav(collection.link, index)}
            >
              <div className="ctaClothing">
                <p>{collection.title}</p>
              </div>
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
            {index === 1 && (
              <div className="highlight">
                <h4>تخفیف ویژه</h4>
                <Highlight products={newSales} />
              </div>
            )}
            {index === 3 && (
              <div className="highlight">
                <h4>بیشترین بازدید</h4>
                <Highlight products={mostViews} />
              </div>
            )}
          </Fragment>
        ))}
      </div>
      <div className="highlight">
        <h4>ارزانترین</h4>
        <Highlight products={cheapestItems} />
      </div>
      <div className="message">
        <p>خرید امن و راحت از بهترین برندهای ایران و دنیا</p>
        <p>با دلماره متفاوت دیده شوید</p>
      </div>
    </Fragment>
  );
}

// initial connection to db
export async function getServerSideProps(context) {
  try {
    await dbConnect();
    const products = await ProductModel.find();
    const newItems = products
      .filter((product) => {
        return product.activate && !product.sale;
      })
      .reverse()
      .slice(0, 5);
    const newSales = products
      .filter((product) => {
        return product.activate && product.sale;
      })
      .reverse()
      .slice(0, 5);
    const mostViews = products
      .filter((product) => {
        return product.activate;
      })
      .sort((a, b) => {
        return b.views - a.views;
      })
      .slice(0, 5);
    const cheapestItems = products
      .filter((product) => {
        return product.activate && product.display;
      })
      .sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
      .slice(0, 5);

    return {
      props: {
        newItems: JSON.parse(JSON.stringify(newItems)),
        newSales: JSON.parse(JSON.stringify(newSales)),
        mostViews: JSON.parse(JSON.stringify(mostViews)),
        cheapestItems: JSON.parse(JSON.stringify(cheapestItems)),
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
