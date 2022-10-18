import { useState, useContext } from "react";
import { StateContext } from "../../context/stateContext";
import CloseIcon from "@mui/icons-material/Close";
import classes from "./BurgerMenu.module.scss";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import Register from "../Register";

import Image from "next/image";
import logo from "../../assets/logo.png";

export default function BurgerMenu() {
  const { menu, setMenu } = useContext(StateContext);
  const { toggleContainer, setToggleContainer } = useContext(StateContext);
  const [register, setRegister] = useState(false);

  const navigation = [
    {
      title: "حساب من",
      icon: <AccountBoxIcon />,
      call: () => {
        setToggleContainer("account");
        setMenu(false);
      },
    },
    {
      title: "کمد من",
      icon: <CheckroomIcon />,
      call: () => {
        setToggleContainer("orders");
        setMenu(false);
      },
    },
    {
      title: "سبد خرید",
      icon: <ShoppingCartIcon />,
      call: () => {
        setToggleContainer("cart");
        setMenu(false);
      },
    },
    {
      title: "سبد آرزو",
      icon: <FavoriteIcon />,
      call: () => {
        setToggleContainer("wish");
        setMenu(false);
      },
    },
    // {
    //   title: "تراکنش",
    //   icon: <ChangeCircleIcon />,
    //   call: () => {
    //     setToggleContainer("transactions");
    //     setMenu(false);
    //   },
    // },
  ];

  return (
    <div className={classes.background}>
      <div className={classes.menu}>
        <div className={classes.cross}>
          <CloseIcon className="icon" onClick={() => setMenu(false)} />
        </div>

        <div className={classes.items}>
          {!register && (
            <div>
              <div className={classes.list}>
                {navigation.map((nav, index) => (
                  <div className={classes.item} key={index} onClick={nav.call}>
                    {nav.icon}
                    <p>{nav.title}</p>
                  </div>
                ))}
              </div>

              <div className={classes.buttonContainer}>
                <button
                  className="mainButton"
                  onClick={() => {
                    setRegister(true);
                  }}
                >
                  ثبت نام
                </button>
              </div>
            </div>
          )}

          <Register props={{ register, setRegister }}></Register>

          <div className={classes.logo}>
            <Image width={100} height={140} src={logo} alt="logo" />
          </div>
        </div>
      </div>
      <div className={classes.close} onClick={() => setMenu(false)}></div>
    </div>
  );
}
