import dbConnect from "../../services/dbConnect";
import User from "../../models/User";

export default async function user(req, res) {
  console.log("connecting");
  await dbConnect();
  console.log("connected");

  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
    console.log("created");
  } catch (err) {
    res.status(500).json(err);
  }
}
