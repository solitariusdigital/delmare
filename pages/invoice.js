import { Fragment, useContext, useEffect, useState } from "react";
import { StateContext } from "../context/stateContext";
import classes from "./page.module.scss";
import Router from "next/router";
import dbConnect from "../services/dbConnect";
import invoiceModel from "../models/Invoice";
import { convertNumber } from "../services/utility";
import { updateInvoiceApi } from "../services/api";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

export default function Invoice({ invoices, postedInvoices }) {
  const { container, setContainer } = useContext(StateContext);
  const [posted, setposted] = useState(false);

  useEffect(() => {
    if (
      !JSON.parse(localStorage.getItem("currentUser")) ||
      JSON.parse(localStorage.getItem("currentUser"))["permission"] ===
        "customer"
    ) {
      Router.push("/");
      return;
    } else {
      setContainer(false);
    }
  }, [setContainer]);

  const convertDate = (date) => {
    return new Date(date).toLocaleDateString("fa-IR");
  };

  const deliverInvoice = async (invoice) => {
    let data = {
      ...invoice,
      posted: true,
    };
    await updateInvoiceApi(data);
    Router.push("/invoice");
  };

  return (
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
          To post
        </p>
        <p
          onClick={() => setposted(true)}
          className={!posted ? classes.nav : classes.navActive}
        >
          Posted
        </p>
        <RefreshIcon
          className="icon"
          onClick={() => Router.push("/invoice")}
          sx={{ fontSize: 30 }}
        />
      </div>

      {!posted && (
        <div>
          <p className={classes.info}>Orders to post {invoices.length}</p>
          {invoices.map((invoice, index) => (
            <div key={index} className={classes.invoice}>
              <div className={classes.row}>
                <p className={classes.title}>تاریخ خرید</p>
                <p suppressHydrationWarning>{convertDate(invoice.createdAt)}</p>
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
                <p className={classes.title}>کد محصول</p>
                <p>{invoice.productId}</p>
              </div>
              <div className={classes.row}>
                <p className={classes.title}>کد آیتم</p>
                <p>{invoice.delmareId}</p>
              </div>
              <div className={classes.row}>
                <p className={classes.title}>آیتم</p>
                <p>{invoice.title}</p>
              </div>
              <div className={classes.row}>
                <p className={classes.title}>قیمت</p>
                <p>{convertNumber(invoice.price)} T</p>
              </div>
              <div className={classes.row}>
                <p className={classes.title}>رنگ</p>
                <div
                  className={classes.color}
                  style={{ backgroundColor: `#${invoice.color}` }}
                ></div>
              </div>
              <div className={classes.row}>
                <p className={classes.title}>اندازه</p>
                <p>{invoice.size}</p>
              </div>
              <button
                className={classes.button}
                onClick={() => deliverInvoice(invoice)}
              >
                Mark posted
              </button>
            </div>
          ))}
        </div>
      )}

      {posted && (
        <div>
          <p className={classes.info}>Posted orders {postedInvoices.length}</p>
          {postedInvoices.map((invoice, index) => (
            <div key={index} className={classes.invoice}>
              <div className={classes.row}>
                <p className={classes.title}>تاریخ خرید</p>
                <p suppressHydrationWarning>{convertDate(invoice.createdAt)}</p>
              </div>
              <div className={classes.row}>
                <p className={classes.title}>تاریخ ارسال</p>
                <p suppressHydrationWarning>{convertDate(invoice.updatedAt)}</p>
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
                <p className={classes.title}>کد محصول</p>
                <p>{invoice.productId}</p>
              </div>
              <div className={classes.row}>
                <p className={classes.title}>کد آیتم</p>
                <p>{invoice.delmareId}</p>
              </div>
              <div className={classes.row}>
                <p className={classes.title}>آیتم</p>
                <p>{invoice.title}</p>
              </div>
              <div className={classes.row}>
                <p className={classes.title}>قیمت</p>
                <p>{convertNumber(invoice.price)} T</p>
              </div>
              <div className={classes.row}>
                <p className={classes.title}>رنگ</p>
                <div
                  className={classes.color}
                  style={{ backgroundColor: `#${invoice.color}` }}
                ></div>
              </div>
              <div className={classes.row}>
                <p className={classes.title}>اندازه</p>
                <p>{invoice.size}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// initial connection to db
export async function getServerSideProps(context) {
  try {
    await dbConnect();
    const data = await invoiceModel.find();
    const invoices = data.reverse().filter((invoice) => {
      return !invoice.posted;
    });
    const postedInvoices = data.filter((invoice) => {
      return invoice.posted;
    });

    return {
      props: {
        invoices: JSON.parse(JSON.stringify(invoices)),
        postedInvoices: JSON.parse(JSON.stringify(postedInvoices)),
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
