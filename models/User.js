import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: false,
    },
    post: {
      type: String,
      required: false,
    },
    permission: {
      type: String,
      required: false,
    },
    favourites: [String],
    follows: [String],
    birthday: String,
    discount: String,
    loyalty: Number,
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);
export default User;
