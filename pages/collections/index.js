import { useContext, useEffect } from "react";
import { StateContext } from "../../context/stateContext";
import Router from "next/router";

import Image from "next/image";
import one from "../../assets/one.jpg";
import two from "../../assets/two.jpg";

function CollectionsPage() {
  const { bar, setBar } = useContext(StateContext);
  const { navigation, setNavigation } = useContext(StateContext);

  useEffect(() => {
    setBar(true);
  }, [setBar]);

  const collections = [
    {
      title: "New",
      link: "/collections/new",
      imageSrc: one,
    },
    {
      title: "Sale",
      link: "/collections/sale",
      imageSrc: two,
    },
    {
      title: "Brands",
      link: "/collections/brands",
      imageSrc: one,
    },
    {
      title: "Bloggers",
      link: "/collections/bloggers",
      imageSrc: two,
    },
  ];

  const activateNav = (link, index) => {
    Router.push(`${link}`);
    navigation.map((nav, i) => {
      if (i === index) {
        nav.active = !nav.active;
      } else {
        nav.active = false;
      }
    });
    setNavigation([...navigation]);
  };

  return (
    <div className="collections-container">
      {collections.map((collection, index) => (
        <div
          key={index}
          className="collections-card"
          onClick={() => activateNav(collection.link, index)}
        >
          <div className="banner">
            <p>{collection.title}</p>
          </div>
          <Image
            className={"image"}
            src={collection.imageSrc}
            alt="image"
            layout="fill"
            objectFit="cover"
          />
        </div>
      ))}
    </div>
  );
}

export default CollectionsPage;
