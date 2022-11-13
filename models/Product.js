import { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
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
    description: {
      type: String,
      required: true,
      maxlength: 250,
    },
    images: {
      main: String,
      one: String,
      two: String,
      three: String,
      table: String,
    },
    size: {
      XS: {},
      S: {},
      M: {},
      L: {},
      XL: {},
      XXL: {},
    },
    price: Number,
    views: Number,
  },
  { timestamps: true }
);

const Product = models.Product || model("Product", ProductSchema);
export default Product;
