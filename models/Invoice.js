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
    userId: {
      type: String,
      required: true,
      maxlength: 30,
    },
    // product info
    productId: {
      type: String,
      required: true,
      maxlength: 30,
    },
    delmareId: {
      type: String,
      required: true,
      maxlength: 30,
    },
    title: {
      type: String,
      required: true,
      maxlength: 20,
    },
    image: String,
    price: Number,
    color: String,
    size: String,
    posted: Boolean,
  },
  { timestamps: true }
);

const Invoice = models.Invoice || model("Invoice", InvoiceSchema);
export default Invoice;
