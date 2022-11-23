import { Schema, model, models } from "mongoose";

const BrandSchema = new Schema(
  {
    delmareId: {
      type: String,
      required: true,
      unique: true,
      maxlength: 30,
    },
    title: {
      type: String,
      required: false,
      maxlength: 20,
    },
    logo: String,
    products: [String],
  },
  { timestamps: true }
);

const Brand = models.Brand || model("Brand", BrandSchema);
export default Brand;
