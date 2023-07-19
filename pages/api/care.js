import Care from "../../models/Care";
import dbConnect from "../../services/dbConnect";
export default async function productHandler(req, res) {
  const { method, body } = req;

  await dbConnect();

  switch (method) {
    case "POST":
      // save data with images link to db after images upload in s3
      try {
        const newCare = await Care.create(body);
        return res.status(200).json(newCare);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
    case "GET":
      try {
        const product = await Care.findById(req.query.id);
        return res.status(200).json(product);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
    case "PUT":
      try {
        const updateCare = await Care.findByIdAndUpdate(body["_id"], body, {
          new: true,
          runValidators: true,
        });
        if (!updateCare) {
          return res.status(400).json({ msg: err.message });
        }
        return res.status(200).json(updateCare);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
  }
}
