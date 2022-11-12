import { useState, useContext } from "react";
import { StateContext } from "../../context/stateContext";
import CloseIcon from "@mui/icons-material/Close";
import classes from "./BurgerMenu.module.scss";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import Person4Icon from "@mui/icons-material/Person4";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import Register from "../Register";
import Image from "next/image";
import logo from "../../assets/logo.png";

export default function BurgerMenu() {
  const { userLogIn, setUserLogin } = useContext(StateContext);
  const { menu, setMenu } = useContext(StateContext);
  const { toggleContainer, setToggleContainer } = useContext(StateContext);
  const { currentUser, seCurrentUser } = useContext(StateContext);
  const { register, setRegister } = useContext(StateContext);

  const [alert, setAlert] = useState("");

  const navigation = [
    {
      title: "حساب من",
      icon: <AccountBoxIcon />,
      call: () => {
        navigateMenu("account");
      },
    },
    {
      title: "کمد من",
      icon: <CheckroomIcon />,
      call: () => {
        navigateMenu("orders");
      },
    },
    {
      title: "سبد خرید",
      icon: <ShoppingCartIcon />,
      call: () => {
        navigateMenu("cart");
      },
    },
    {
      title: "سبد آرزو",
      icon: <FavoriteIcon />,
      call: () => {
        navigateMenu("wish");
      },
    },
    // {
    //   title: "تراکنش",
    //   icon: <ChangeCircleIcon />,
    //   call: () => {
    //     navigateMenu("transactions");
    //   },
    // },
  ];

  const navigateMenu = (action) => {
    if (userLogIn || action === "cart") {
      setToggleContainer(action);
      setMenu(false);
    } else {
      setAlert("برای دسترسی وارد شوید");
    }
    setTimeout(() => {
      setAlert("");
    }, 3000);
  };

  return (
    <div className={classes.slider}>
      <div className={classes.menu}>
        <div className={classes.cross}>
          <CloseIcon
            className="icon"
            onClick={() => {
              setMenu(false);
              setRegister(false);
            }}
          />
          {currentUser && (
            <div
              className={classes.user}
              onClick={() => navigateMenu("account")}
            >
              <Person4Icon className="icon" />
              <p>
                {currentUser.name === "" ? currentUser.phone : currentUser.name}
              </p>
            </div>
          )}
        </div>

        <div className={classes.items}>
          {!register ? (
            <div>
              <div className={classes.list}>
                {navigation.map((nav, index) => (
                  <div className={classes.item} key={index} onClick={nav.call}>
                    {nav.icon}
                    <p>{nav.title}</p>
                  </div>
                ))}
              </div>

              {!userLogIn && (
                <div className={classes.buttonContainer}>
                  <button
                    className={`mainButton ${classes.button}`}
                    onClick={() => {
                      setRegister(true);
                    }}
                  >
                    ورود / ​ثبت نام
                  </button>
                  <p className={classes.alert}>{alert}</p>
                </div>
              )}
            </div>
          ) : (
            // login form
            <Register></Register>
          )}
          <div className={classes.logo}>
            <Image width={100} height={140} src={logo} alt="logo" />
          </div>
        </div>
      </div>
    </div>
  );
}
