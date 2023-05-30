import { Schema, model, models } from "mongoose";

const ImageSchema = new Schema({
  main: String,
  one: String,
  two: String,
  three: String,
  table: String,
  graph: String,
});

const SizeSchema = new Schema({
  XS: {},
  S: {},
  M: {},
  L: {},
  XL: {},
  FS: {},
  34: {},
  35: {},
  36: {},
  37: {},
  38: {},
  39: {},
  40: {},
  41: {},
  42: {},
  43: {},
  44: {},
  45: {},
});

const ProductSchema = new Schema(
  {
    delmareId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: ImageSchema,
      required: true,
    },
    size: {
      type: SizeSchema,
      required: true,
    },
    category: String,
    season: String,
    brand: String,
    brandType: String,
    deliveryType: String,
    price: Number,
    discount: Number,
    percentage: Number,
    sale: Boolean,
    activate: Boolean,
    display: Boolean,
    views: Number,
  },
  { timestamps: true }
);

const Product = models.Product || model("Product", ProductSchema);
export default Product;
