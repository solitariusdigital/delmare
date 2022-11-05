import { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    imageId: {
      type: String,
      unique: true,
    },
    title: {
      type: String,
      required: false,
      maxlength: 20,
    },
    link: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
      maxlength: 250,
    },
  },
  { timestamps: true }
);

const Product = models.Product || model("Product", ProductSchema);
export default Product;
