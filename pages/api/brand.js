import Brand from "../../models/Brand";
import dbConnect from "../../services/dbConnect";

export default async function brandHandler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=10");
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const brand = await Brand.findById(req.query.id);
        return res.status(200).json(brand);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
  }
}
