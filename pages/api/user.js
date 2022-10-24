import dbConnect from "../../services/dbConnect";
import User from "../../models/User";

export default async function user(req, res) {
  const { method } = req;

  console.log("connecting");
  await dbConnect();
  console.log("connected");

  switch (method) {
    case "POST":
      try {
        const user = await User.create(req.body);
        res.status(201).json(user);
        console.log("created");
      } catch (err) {
        res.status(500).json(err);
      }
      break;
    case "GET":
      try {
        const users = await User.find();
        res.status(200).json(users);
        console.log("fetched");
      } catch (err) {
        res.status(500).json(err);
      }
      break;
  }
}
