import { useContext, useEffect } from "react";
import { StateContext } from "../../context/stateContext";
import Router from "next/router";

import Image from "next/image";
import one from "../../assets/one.jpg";
import two from "../../assets/two.jpg";

function CollectionsPage() {
  const { bar, setBar } = useContext(StateContext);

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

  return (
    <div className="collections-container">
      {collections.map((collection, index) => (
        <div key={index} className="collections-card">
          <div
            className="banner"
            onClick={() => Router.push(`${collection.link}`)}
          >
            <p>{collection.title}</p>
          </div>
          <Image
            src={collection.imageSrc}
            alt="image"
            onClick={() => Router.push(`${collection.link}`)}
            layout="fill"
            objectFit="cover"
            className={"image"}
          />
        </div>
      ))}
    </div>
  );
}

export default CollectionsPage;
