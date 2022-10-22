import dbConnect from "../../services/dbConnect";

export default async function user(req, res) {
  try {
    console.log("connecting");
    await dbConnect();
    console.log("connected");

    const user = await User.create(req.body);
    console.log("created");

    res.json({ user });
  } catch (error) {
    res.json({ error });
    console.log(error);
  }
}
