import Message from "../../models/Message";
import dbConnect from "../../services/dbConnect";

export default async function messageandler(req, res) {
  const { method, body } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const message = await Message.find();
        return res.status(200).json(message);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
  }
}
