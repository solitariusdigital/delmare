import { Schema, model, models } from "mongoose";

const InvoiceSchema = new Schema(
  {
    // user info
    name: {
      type: String,
      required: true,
      maxlength: 20,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
      maxlength: 150,
    },
    post: {
      type: String,
      required: true,
      maxlength: 20,
    },
    // product info
    productId: {
      type: String,
      required: true,
      maxlength: 30,
    },
    odinId: {
      type: String,
      required: true,
      maxlength: 30,
    },
    title: {
      type: String,
      required: true,
      maxlength: 20,
    },
    price: Number,
    color: String,
    size: String,
  },
  { timestamps: true }
);

const Invoice = models.Invoice || model("Invoice", InvoiceSchema);
export default Invoice;
