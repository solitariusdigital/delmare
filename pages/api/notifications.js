import Notification from "../../models/Notification";
import dbConnect from "../../services/dbConnect";

export default async function notificationHandler(req, res) {
  const { method, body } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const notification = await Notification.find();
        return res.status(200).json(notification);
      } catch (err) {
        return res.status(400).json({ msg: err.notification });
      }
  }
}
