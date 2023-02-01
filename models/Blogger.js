import { Schema, model, models } from "mongoose";

const BloggerSchema = new Schema(
  {
    delmareId: {
      type: String,
      required: true,
      unique: true,
      maxlength: 30,
    },
    name: {
      type: String,
      required: false,
      maxlength: 20,
    },
    bio: {
      type: String,
      required: false,
      maxlength: 300,
    },
    image: String,
    userId: String,
    followers: [String],
    views: Number,
  },
  { timestamps: true }
);

const Blogger = models.Blogger || model("Blogger", BloggerSchema);
export default Blogger;
