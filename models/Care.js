import { Schema, model, models } from "mongoose";

const CareSchema = new Schema(
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
    },
    size: String,
    count: Number,
    category: String,
    type: String,
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
    group: String,
  },
  { timestamps: true }
);

const Care = models.Care || model("Care", CareSchema);
export default Care;
