/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable @next/next/no-img-element */
import { useContext } from "react";
import { StateContext } from "../../context/stateContext";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCart from "./ShoppingCart.module.scss";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import classes from "./About.module.scss";
import FiberManualRecordOutlined from "@mui/icons-material/FiberManualRecordOutlined";
import Image from "next/image";
import logo from "../../assets/logo.svg";

export default function About() {
  const { toggleContainer, setToggleContainer } = useContext(StateContext);
  const { shoppingCart, setShoppingCart } = useContext(StateContext);
  const videoLink = `https://delmare.storage.iran.liara.space/landingpage/video.MOV#t=0.5`;

  return (
    <div className={ShoppingCart.slider} style={{ height: window.innerHeight }}>
      <div className={ShoppingCart.menu}>
        <div className={ShoppingCart.topBar}>
          <CloseIcon className="icon" onClick={() => setToggleContainer("")} />
          <div className={ShoppingCart.title}>
            <p>دلماره</p>
          </div>
          <div className="shoppingcart-icon">
            <ShoppingCartIcon
              className="icon"
              onClick={() => setToggleContainer("cart")}
            />
            <p>{shoppingCart.length === 0 ? "" : shoppingCart.length}</p>
          </div>
        </div>
        <div className={classes.description}>
          <div className={classes.row}>
            <FiberManualRecordOutlined sx={{ fontSize: 8 }} />
            <p>
              مولتی برند دلماره مجموعه ای از کارآفرینان، طراحان لباس، برنامه
              نویسان، عکاسان مد و استایلیست ها هستند، که با بهره گیری از تجربه
              چندین ساله خود در زمینه مد و لباس، تلاش می کنند تجربه خرید خوشایند
              و منطبق با استانداردهای روز دنیای فشن را برای شما فراهم کنند
            </p>
          </div>
          <div className={classes.row}>
            <FiberManualRecordOutlined sx={{ fontSize: 8 }} />
            <p>
              ما با کمک بهترین استایلیست های ایران استایل های زیبا و متفاوت را
              برای شما آماده کرده ایم که شامل بهترین برندهای ایرانی و برندهای
              معروف دنیا هستند
            </p>
          </div>
          <div className={classes.row}>
            <FiberManualRecordOutlined sx={{ fontSize: 8 }} />
            <p>
              برندهای ایرانی همکار ما همگی از برندهای معروف و شناخته شده ایران
              هستند که دارای بالاترین کیفیت دوخت، پارچه و طراحی هستند
            </p>
          </div>
          <div className={classes.videoContainer}>
            <video
              className={classes.video}
              preload="metadata"
              controls
              src={videoLink}
              loop
            />
          </div>
          <div className={classes.row}>
            <FiberManualRecordOutlined sx={{ fontSize: 8 }} />
            <p>
              لاین واردات دلماره شامل برندهای لاکچری دنیا از قبیل گوچی، لوییز
              ویتون، الکساندر مککویین و همچنین برندهای پرطرفدار از جمله آدیداس،
              نایکی، اچ اند ام و زارا می باشد. کلیه اجناس از نمایندگی های این
              برندها از ایتالیا وارد می شوند
            </p>
          </div>
          <div className={classes.row}>
            <FiberManualRecordOutlined sx={{ fontSize: 8 }} />
            <p>
              دلماره همه تلاش خود را می کند تا زمان رسیدن محصول به دست شما
              کوتاهترین زمان ممکن باشد. تیم دلماره به صورت شبانه روز در حال
              ارتقا خود است و امیدوار است در سال های آینده بسیاری از خریدهای شما
              را در مجموعه خود پاسخگو باشد و در ذخیره زمان ارزشمند شما کمک رسان
              باشد
            </p>
          </div>
          <div className={classes.logo}>
            <div>
              <Image width={90} height={140} src={logo} alt="logo" />
            </div>
            <div>
              <a>
                <img
                  referrerPolicy="origin"
                  src="https://Trustseal.eNamad.ir/logo.aspx?id=311141&amp;Code=GPyVAMJIOJVa0l6MNns2"
                  id="GPyVAMJIOJVa0l6MNns2"
                  decoding="async"
                  alt="enamad logo"
                />
              </a>
            </div>
          </div>
          <div className={classes.copyright}>
            <p>کليه حقوق اين وب اپلیکیشن به دلماره تعلق دارد</p>
            <p>
              <span onClick={() => Router.push("/")}>delmareh.com</span> - 2023
              @Copyright
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
