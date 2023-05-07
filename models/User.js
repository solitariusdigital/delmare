import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
      maxlength: 20,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: false,
      maxlength: 300,
    },
    post: {
      type: String,
      required: false,
      maxlength: 20,
    },
    permission: {
      type: String,
      required: false,
      maxlength: 20,
    },
    favourites: [String],
    follows: [String],
    birthday: String,
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);
export default User;
