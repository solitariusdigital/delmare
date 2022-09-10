import Link from "next/link";

import classes from "./MainNavigation.module.scss";

function MainNavigation() {
  return (
    <header className={classes.header}>
      <div className={classes.logo}>DELMARE</div>
      <nav>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/profile">Profile</Link>
          </li>
          <li>
            <Link href="/new">New</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
