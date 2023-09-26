import Blogger from "../../models/Blogger";
import dbConnect from "../../services/dbConnect";

export default async function bloggerHandler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=10");
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const blogger = await Blogger.findById(req.query.id);
        return res.status(200).json(blogger);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
  }
}
