import Brand from "../../models/Brand";
import dbConnect from "../../services/dbConnect";

export default async function brandsHandler(req, res) {
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
    case "PUT":
      try {
        const updateBrand = await Brand.findByIdAndUpdate(body["_id"], body, {
          new: true,
          runValidators: true,
        });
        if (!updateBrand) {
          return res.status(400).json({ msg: err.message });
        }
        return res.status(200).json(updateBrand);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
  }
}
