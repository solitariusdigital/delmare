import { Schema, model, models } from "mongoose";

const BloggerSchema = new Schema(
  {
    delmareId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: false,
    },
    bio: {
      type: String,
      required: false,
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
