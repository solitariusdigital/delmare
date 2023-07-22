import { Fragment, useContext, useEffect, useState } from "react";
import { StateContext } from "../context/stateContext";
import classes from "./page.module.scss";
import Router from "next/router";
import dbConnect from "../services/dbConnect";
import invoiceModel from "../models/Invoice";
import {
  convertNumber,
  convertDate,
  calculatePercentage,
} from "../services/utility";
import { updateInvoiceApi } from "../services/api";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Head from "next/head";
import Image from "next/image";
import secureLocalStorage from "react-secure-storage";

export default function Invoice({ invoices, newInvoices, postedInvoices }) {
  const { container, setContainer } = useContext(StateContext);
  const { navigationBottom, setNavigationBottom } = useContext(StateContext);
  const [posted, setposted] = useState(false);
  const [displayPage, setDisplayPage] = useState(false);

  const [deliveryCourier, setDeliveryCourier] = useState("");
  const [deliveryId, setDeliveryId] = useState("");

  useEffect(() => {
    if (
      !JSON.parse(secureLocalStorage.getItem("currentUser")) ||
      JSON.parse(secureLocalStorage.getItem("currentUser"))["permission"] ===
        "admin" ||
      JSON.parse(secureLocalStorage.getItem("currentUser"))["permission"] ===
        "subadmin"
    ) {
      setContainer(false);
      setDisplayPage(true);
      setNavigationBottom(false);
    } else {
      Router.push("/");
    }
  }, [setContainer, setNavigationBottom]);

  const postInvoice = async (invoice) => {
    let positionY = window.scrollY;
    let data = {
      ...invoice,
      posted: true,
      deliveryCourier: deliveryCourier,
      deliveryId: deliveryId,
    };
    await updateInvoiceApi(data);
    setDeliveryId("");
    setDeliveryCourier("");
    Router.push("/invoice");
    setTimeout(() => {
      window.scrollTo(0, positionY);
    }, 500);
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
      {displayPage && (
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
              <button className="mainButton" onClick={() => setposted(false)}>
                سفارشات
              </button>
              <button className="mainButton" onClick={() => setposted(true)}>
                ارسال شده
              </button>
              <RefreshIcon
                className="icon"
                onClick={() => Router.reload(window.location.pathname)}
                sx={{ fontSize: 30 }}
              />
            </div>

            {!posted && (
              <div>
                <div className={classes.infoBar}>
                  <p>سفارشات {newInvoices.length}</p>
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
                      <p className={classes.title}>قیمت فروش</p>
                      <p>{convertNumber(invoice.price)} T</p>
                    </div>
                    <div className={classes.row}>
                      <p className={classes.title}>قیمت اصلی</p>
                      <p>
                        {invoice.originalPrice
                          ? convertNumber(invoice.originalPrice)
                          : "-"}{" "}
                        T
                      </p>
                    </div>
                    <div className={classes.row}>
                      <p className={classes.title}>درصد بلاگر</p>
                      {invoice.bloggerDelmareId === "DELMAREH" ? (
                        <div className={classes.bloggerRow}>
                          <p>
                            {convertNumber(
                              calculatePercentage(28, invoice.price)
                            )}{" "}
                            T
                          </p>
                          <p>{invoice.bloggerDelmareId}</p>
                        </div>
                      ) : (
                        <div className={classes.bloggerPercentage}>
                          <div className={classes.bloggerRow}>
                            <p>
                              {convertNumber(
                                calculatePercentage(13, invoice.price)
                              )}{" "}
                              T
                            </p>
                            <p>DELMAREH</p>
                          </div>
                          <div className={classes.bloggerRow}>
                            <p>
                              {convertNumber(
                                calculatePercentage(15, invoice.price)
                              )}{" "}
                              T
                            </p>
                            <p>{invoice.bloggerDelmareId}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className={classes.row}>
                      <p className={classes.title}>تحویل</p>
                      <p>{invoice.deliveryType}</p>
                    </div>
                    <div className={classes.row}>
                      <p className={classes.title}>کد آیتم</p>
                      <p>{invoice.delmareId}</p>
                    </div>
                    <div className={classes.row}>
                      <p className={classes.title}>کد رهگیری دلماره</p>
                      <p>{invoice.refId}</p>
                    </div>
                    <div className={classes.row}>
                      <div className={classes.radioContainer}>
                        <div className={classes.radio}>
                          <input
                            type="radio"
                            value="TIPAX"
                            checked={deliveryCourier === "TIPAX"}
                            onChange={(e) => setDeliveryCourier(e.target.value)}
                          />
                          <p>TIPAX</p>
                        </div>
                        <div className={classes.radio}>
                          <input
                            type="radio"
                            value="Snapp"
                            checked={deliveryCourier === "Snapp"}
                            onChange={(e) => setDeliveryCourier(e.target.value)}
                          />
                          <p>Snapp</p>
                        </div>
                      </div>
                      <input
                        type="text"
                        id="deliveryId"
                        name="deliveryId"
                        placeholder="کد رهگیری"
                        onChange={(e) => setDeliveryId(e.target.value)}
                        value={deliveryId}
                        autoComplete="off"
                      />
                    </div>
                    <button
                      className={classes.button}
                      onClick={() => postInvoice(invoice)}
                    >
                      ارسال شده
                    </button>
                  </div>
                ))}
              </div>
            )}
            {posted && (
              <div>
                <div className={classes.infoBar}>
                  <p>ارسال شده {postedInvoices.length}</p>
                </div>
                {postedInvoices.map((invoice, index) => (
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
                      <p className={classes.title}>قیمت فروش</p>
                      <p>{convertNumber(invoice.price)} T</p>
                    </div>
                    <div className={classes.row}>
                      <p className={classes.title}>قیمت اصلی</p>
                      <p>
                        {invoice.originalPrice
                          ? convertNumber(invoice.originalPrice)
                          : "-"}{" "}
                        T
                      </p>
                    </div>
                    <div className={classes.row}>
                      <p className={classes.title}>درصد بلاگر</p>
                      {invoice.bloggerDelmareId === "DELMAREH" ? (
                        <div className={classes.bloggerRow}>
                          <p>
                            {convertNumber(
                              calculatePercentage(28, invoice.price)
                            )}{" "}
                            T
                          </p>
                          <p>{invoice.bloggerDelmareId}</p>
                        </div>
                      ) : (
                        <div className={classes.bloggerPercentage}>
                          <div className={classes.bloggerRow}>
                            <p>
                              {convertNumber(
                                calculatePercentage(13, invoice.price)
                              )}{" "}
                              T
                            </p>
                            <p>DELMAREH</p>
                          </div>
                          <div className={classes.bloggerRow}>
                            <p>
                              {convertNumber(
                                calculatePercentage(15, invoice.price)
                              )}{" "}
                              T
                            </p>
                            <p>{invoice.bloggerDelmareId}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className={classes.row}>
                      <p className={classes.title}>تحویل</p>
                      <p>{invoice.deliveryType}</p>
                    </div>
                    <div className={classes.row}>
                      <p className={classes.title}>کد آیتم</p>
                      <p>{invoice.delmareId}</p>
                    </div>
                    <div className={classes.row}>
                      <p className={classes.title}>کد رهگیری دلماره</p>
                      <p>{invoice.refId}</p>
                    </div>
                    {invoice.deliveryCourier && (
                      <div className={classes.row}>
                        <p className={classes.title}>مشخصات ارسال</p>
                        <p>
                          {invoice.deliveryCourier} {invoice.deliveryId}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
}

// initial connection to db
export async function getServerSideProps(context) {
  try {
    await dbConnect();
    const invoices = await invoiceModel.find();
    const newInvoices = invoices
      .filter((invoice) => !invoice.posted)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const postedInvoices = invoices
      .filter((invoice) => invoice.posted)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    return {
      props: {
        invoices: JSON.parse(JSON.stringify(invoices)),
        newInvoices: JSON.parse(JSON.stringify(newInvoices)),
        postedInvoices: JSON.parse(JSON.stringify(postedInvoices)),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
}
