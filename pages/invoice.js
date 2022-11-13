import { Fragment, useContext, useEffect, useState } from "react";
import { StateContext } from "../context/stateContext";
import classes from "./page.module.scss";
import Router from "next/router";
import dbConnect from "../services/dbConnect";
import invoiceModel from "../models/Invoice";
import { convertNumber } from "../services/utility";

export default function Invoice({ invoices }) {
  const { container, setContainer } = useContext(StateContext);

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

  return (
    <Fragment>
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
        </div>
      ))}
    </Fragment>
  );
}

// initial connection to db
export async function getServerSideProps(context) {
  try {
    await dbConnect();
    const invoices = await invoiceModel.find();

    return {
      props: {
        invoices: JSON.parse(JSON.stringify(invoices)),
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
