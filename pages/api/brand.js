import Brand from "../../models/Brand";
import dbConnect from "../../services/dbConnect";

export default async function brandHandler(req, res) {
  const { method, body } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const brands = await Brand.find();
        return res.status(200).json(brands);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
  }
}
