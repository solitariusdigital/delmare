import Product from "../../models/Product";
import dbConnect from "../../services/dbConnect";
export default async function productHandler(req, res) {
  const { method, body } = req;

  await dbConnect();

  switch (method) {
    case "POST":
      // save data with images link to db after images upload in s3
      try {
        const newProduct = await Product.create(body);
        return res.status(200).json(newProduct);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
    case "GET":
      try {
        const product = await Product.findById(req.query.id);
        return res.status(200).json(product);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
    case "PUT":
      try {
        const updateProduct = await Product.findByIdAndUpdate(
          body["_id"],
          body,
          {
            new: true,
            runValidators: true,
          }
        );
        if (!updateProduct) {
          return res.status(400).json({ msg: err.message });
        }
        return res.status(200).json(updateProduct);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
  }
}
