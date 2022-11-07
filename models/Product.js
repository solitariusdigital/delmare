import { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 20,
    },
    description: {
      type: String,
      required: false,
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
    price: String,
    views: Number,
    likes: Number,
  },
  { timestamps: true }
);

const Product = models.Product || model("Product", ProductSchema);
export default Product;
