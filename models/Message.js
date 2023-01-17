import { Schema, model, models } from "mongoose";

const MessageSchema = new Schema(
  {
    message: {
      active: Boolean,
      text: String,
    },
  },
  { timestamps: true }
);

const Message = models.Message || model("Message", MessageSchema);
export default Message;
