import { Schema, model, models } from "mongoose";

const InvoiceSchema = new Schema(
  {
    // user info
    name: {
      type: String,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    post: {
      type: String,
    },
    userId: {
      type: String,
    },
    // product info
    productId: {
      type: String,
    },
    delmareId: {
      type: String,
    },
    title: {
      type: String,
    },
    image: String,
    price: Number,
    color: String,
    size: String,
    posted: Boolean,
    refId: String,
    deliveryType: String,
    bloggerDelmareId: String,
  },
  { timestamps: true }
);

const Invoice = models.Invoice || model("Invoice", InvoiceSchema);
export default Invoice;
