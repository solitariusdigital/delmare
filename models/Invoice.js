import { Schema, model, models } from "mongoose";

const InvoiceSchema = new Schema(
  {
    // user info
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    post: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    // product info
    productId: {
      type: String,
      required: true,
    },
    delmareId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
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
