import dbConnect from "../../services/dbConnect";
import Care from "../../models/Care";

export default async function caresHandler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=10");
  const { method } = req;
  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const cares = await Care.find();
        return res.status(200).json(cares);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
  }
}
