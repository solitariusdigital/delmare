import { Fragment, useContext, useEffect, useState } from "react";
import { StateContext } from "../context/stateContext";
import classes from "./page.module.scss";
import Router from "next/router";
import dbConnect from "../services/dbConnect";
import invoiceModel from "../models/Invoice";
import { convertNumber } from "../services/utility";
import { updateInvoiceApi } from "../services/api";
import RefreshIcon from "@mui/icons-material/Refresh";

export default function Invoice({ invoices, deliveredInvoices }) {
  const { container, setContainer } = useContext(StateContext);
  const [delivered, setDelivered] = useState(false);

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
    return new Date(date).toLocaleString("en-AU", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const deliverInvoice = async (invoice) => {
    let data = {
      ...invoice,
      delivered: true,
    };
    await updateInvoiceApi(data);
    Router.push("/invoice");
  };

  return (
    <div className={classes.invoiceContainer}>
      <div className={classes.navigation}>
        <p
          onClick={() => setDelivered(false)}
          className={delivered ? classes.nav : classes.navActive}
        >
          To deliver
        </p>
        <p
          onClick={() => setDelivered(true)}
          className={!delivered ? classes.nav : classes.navActive}
        >
          Delivered
        </p>
        <RefreshIcon
          className="icon"
          onClick={() => Router.push("/invoice")}
          sx={{ fontSize: 24 }}
        />
      </div>

      {!delivered && (
        <div>
          <p className={classes.info}>Orders to deliver {invoices.length}</p>
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
                Mark as delivered
              </button>
            </div>
          ))}
        </div>
      )}

      {delivered && (
        <div>
          <p className={classes.info}>
            Delivered orders {deliveredInvoices.length}
          </p>
          {deliveredInvoices.map((invoice, index) => (
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
      return !invoice.delivered;
    });
    const deliveredInvoices = data.filter((invoice) => {
      return invoice.delivered;
    });

    return {
      props: {
        invoices: JSON.parse(JSON.stringify(invoices)),
        deliveredInvoices: JSON.parse(JSON.stringify(deliveredInvoices)),
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
