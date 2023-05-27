import { Schema, model, models } from "mongoose";

const InvoiceSchema = new Schema(
  {
    // user info
    name: String,
    phone: String,
    address: String,
    post: String,
    userId: String,
    // product info
    productId: String,
    delmareId: String,
    title: String,
    image: String,
    originalPrice: Number,
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
