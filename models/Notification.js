import { Schema, model, models } from "mongoose";

const NotificationSchema = new Schema(
  {
    sms: {
      active: Boolean,
      text: String,
    },
  },
  { timestamps: true }
);

const Notification =
  models.Notification || model("Notification", NotificationSchema);
export default Notification;
