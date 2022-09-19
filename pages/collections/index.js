import { useContext, useEffect, Fragment } from "react";
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

  return (
    <div className="collections-container">
      <div className="collections-card">
        <div className="banner" onClick={() => Router.push("/collections/new")}>
          <p>new</p>
        </div>
        <Image
          src={one}
          alt="image"
          onClick={() => Router.push("/collections/new")}
          layout="fill"
          objectFit="cover"
          className={"image"}
        />
      </div>
      <div className="collections-card">
        <div className="banner" onClick={() => Router.push("/collections/new")}>
          <p>new</p>
        </div>
        <Image
          src={two}
          alt="image"
          onClick={() => Router.push("/collections/new")}
          layout="fill"
          objectFit="cover"
          className={"image"}
        />
      </div>
      <div className="collections-card">
        <div className="banner" onClick={() => Router.push("/collections/new")}>
          <p>new</p>
        </div>
        <Image
          src={one}
          alt="image"
          onClick={() => Router.push("/collections/new")}
          layout="fill"
          objectFit="cover"
          className={"image"}
        />
      </div>
      <div className="collections-card">
        <div className="banner" onClick={() => Router.push("/collections/new")}>
          <p>new</p>
        </div>
        <Image
          src={two}
          alt="image"
          onClick={() => Router.push("/collections/new")}
          layout="fill"
          objectFit="cover"
          className={"image"}
        />
      </div>
      <div className="collections-card">
        <div className="banner" onClick={() => Router.push("/collections/new")}>
          <p>new</p>
        </div>
        <Image
          src={one}
          alt="image"
          onClick={() => Router.push("/collections/new")}
          layout="fill"
          objectFit="cover"
          className={"image"}
        />
      </div>
      <div className="collections-card">
        <div className="banner" onClick={() => Router.push("/collections/new")}>
          <p>new</p>
        </div>
        <Image
          src={two}
          alt="image"
          onClick={() => Router.push("/collections/new")}
          layout="fill"
          objectFit="cover"
          className={"image"}
        />
      </div>
    </div>
  );
}

export default CollectionsPage;
