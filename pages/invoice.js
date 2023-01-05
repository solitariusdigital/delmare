import { Fragment, useContext, useEffect, useState } from "react";
import { StateContext } from "../context/stateContext";
import classes from "./page.module.scss";
import Router from "next/router";
import dbConnect from "../services/dbConnect";
import invoiceModel from "../models/Invoice";
import { convertNumber, convertDate } from "../services/utility";
import { updateInvoiceApi } from "../services/api";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Head from "next/head";
import Image from "next/image";
import secureLocalStorage from "react-secure-storage";

export default function Invoice({ invoices, newInvoices, postedInvoices }) {
  const { container, setContainer } = useContext(StateContext);
  const [posted, setposted] = useState(false);
  const [startDate, setStartDate] = useState(new Date());

  useEffect(() => {
    if (
      !JSON.parse(secureLocalStorage.getItem("currentUser")) ||
      JSON.parse(secureLocalStorage.getItem("currentUser"))["permission"] ===
        "customer"
    ) {
      Router.push("/");
      return;
    } else {
      setContainer(false);
    }
  }, [setContainer]);

  const postInvoice = async (invoice) => {
    let data = {
      ...invoice,
      posted: true,
    };
    await updateInvoiceApi(data);
    Router.push("/invoice");
  };

  const calculateTotalSale = () => {
    let price = [];
    invoices.forEach((invoice) => {
      price.push(invoice.price);
    });
    return price.reduce((partialSum, a) => partialSum + a, 0);
  };

  return (
    <Fragment>
      <Head>
        <title>Invoices</title>
        <meta name="description" content="Manage new orders and invoices" />
      </Head>
      <div className={classes.invoiceContainer}>
        <div className={classes.navigation}>
          <ArrowBackIosNewIcon
            className="icon"
            onClick={() => Router.push("/")}
            sx={{ fontSize: 30 }}
          />
          <p
            onClick={() => setposted(false)}
            className={posted ? classes.nav : classes.navActive}
          >
            ارسالی جدید
          </p>
          <p
            onClick={() => setposted(true)}
            className={!posted ? classes.nav : classes.navActive}
          >
            ارسال شده
          </p>
          <RefreshIcon
            className="icon"
            onClick={() => Router.reload(window.location.pathname)}
            sx={{ fontSize: 30 }}
          />
        </div>

        {!posted && (
          <div>
            <div className={classes.infoBar}>
              <p>سفارشات جدید {newInvoices.length}</p>
              <p>{convertNumber(calculateTotalSale())}</p>
            </div>
            {newInvoices.map((invoice, index) => (
              <div key={index} className={classes.infoCard}>
                <div className={classes.row}>
                  <div>
                    <div className={classes.subRow}>
                      <p className={classes.title}>آیتم</p>
                      <p>{invoice.title}</p>
                    </div>
                    <div className={classes.subRow}>
                      <p className={classes.title}>رنگ</p>
                      <div
                        className={classes.color}
                        style={{ backgroundColor: `#${invoice.color}` }}
                      ></div>
                    </div>
                    <div className={classes.subRow}>
                      <p className={classes.title}>اندازه</p>
                      <p>{invoice.size}</p>
                    </div>
                  </div>
                  <Image
                    className={classes.image}
                    src={invoice.image}
                    objectFit="cover"
                    width={100}
                    height={140}
                    alt="image"
                  />
                </div>
                <div className={classes.row}>
                  <p className={classes.title}>تاریخ خرید</p>
                  <p suppressHydrationWarning>
                    {convertDate(invoice.createdAt)}
                  </p>
                </div>
                <div className={classes.row}>
                  <p className={classes.title}>نام مشتری</p>
                  <p>{invoice.name}</p>
                </div>
                <div className={classes.row}>
                  <p className={classes.title}>موبایل</p>
                  <p>{invoice.phone}</p>
                </div>
                <div className={classes.row}>
                  <p className={classes.title}>آدرس</p>
                  <p>{invoice.address}</p>
                </div>
                <div className={classes.row}>
                  <p className={classes.title}>کد پستی</p>
                  <p>{invoice.post}</p>
                </div>
                <div className={classes.row}>
                  <p className={classes.title}>قیمت</p>
                  <p>{convertNumber(invoice.price)} T</p>
                </div>
                <div className={classes.row}>
                  <p className={classes.title}>کد آیتم</p>
                  <p>{invoice.delmareId}</p>
                </div>
                <div className={classes.row}>
                  <p className={classes.title}>کد محصول</p>
                  <p>{invoice.productId}</p>
                </div>
                <div className={classes.row}>
                  <p className={classes.title}>کد رهگیری</p>
                  <p>{invoice.refId}</p>
                </div>
                <button
                  className={classes.button}
                  onClick={() => postInvoice(invoice)}
                >
                  انتقال به ارسال شده
                </button>
              </div>
            ))}
          </div>
        )}

        {posted && (
          <div>
            <div className={classes.infoBar}>
              <p>سفارشات ارسال شده {postedInvoices.length}</p>
            </div>
            {postedInvoices.map((invoice, index) => (
              <div key={index} className={classes.invoice}>
                <div className={classes.row}>
                  <div>
                    <div className={classes.subRow}>
                      <p className={classes.title}>آیتم</p>
                      <p>{invoice.title}</p>
                    </div>
                    <div className={classes.subRow}>
                      <p className={classes.title}>رنگ</p>
                      <div
                        className={classes.color}
                        style={{ backgroundColor: `#${invoice.color}` }}
                      ></div>
                    </div>
                    <div className={classes.subRow}>
                      <p className={classes.title}>اندازه</p>
                      <p>{invoice.size}</p>
                    </div>
                  </div>
                  <Image
                    className={classes.image}
                    src={invoice.image}
                    objectFit="cover"
                    width={100}
                    height={140}
                    alt="image"
                  />
                </div>
                <div className={classes.row}>
                  <p className={classes.title}>تاریخ ارسال</p>
                  <p suppressHydrationWarning>
                    {convertDate(invoice.updatedAt)}
                  </p>
                </div>
                <div className={classes.row}>
                  <p className={classes.title}>تاریخ خرید</p>
                  <p suppressHydrationWarning>
                    {convertDate(invoice.createdAt)}
                  </p>
                </div>
                <div className={classes.row}>
                  <p className={classes.title}>نام مشتری</p>
                  <p>{invoice.name}</p>
                </div>
                <div className={classes.row}>
                  <p className={classes.title}>موبایل</p>
                  <p>{invoice.phone}</p>
                </div>
                <div className={classes.row}>
                  <p className={classes.title}>آدرس</p>
                  <p>{invoice.address}</p>
                </div>
                <div className={classes.row}>
                  <p className={classes.title}>کد پستی</p>
                  <p>{invoice.post}</p>
                </div>
                <div className={classes.row}>
                  <p className={classes.title}>قیمت</p>
                  <p>{convertNumber(invoice.price)} T</p>
                </div>
                <div className={classes.row}>
                  <p className={classes.title}>کد آیتم</p>
                  <p>{invoice.delmareId}</p>
                </div>
                <div className={classes.row}>
                  <p className={classes.title}>کد محصول</p>
                  <p>{invoice.productId}</p>
                </div>
                <div className={classes.row}>
                  <p className={classes.title}>کد رهگیری</p>
                  <p>{invoice.refId}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Fragment>
  );
}

// initial connection to db
export async function getServerSideProps(context) {
  try {
    await dbConnect();
    const invoices = await invoiceModel.find();
    const newInvoices = invoices.reverse().filter((invoice) => {
      return !invoice.posted;
    });
    const postedInvoices = invoices.filter((invoice) => {
      return invoice.posted;
    });

    return {
      props: {
        invoices: JSON.parse(JSON.stringify(invoices)),
        newInvoices: JSON.parse(JSON.stringify(newInvoices)),
        postedInvoices: JSON.parse(JSON.stringify(postedInvoices)),
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
