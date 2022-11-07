import Product from "../../models/Product";
import dbConnect from "../../services/dbConnect";
// save data with images link to db after images upload
export default async function productHandler(req, res) {
  await dbConnect();

  try {
    const newProduct = await Product.create(req.body);
    return res.status(200).json(newProduct);
  } catch (err) {
    return res.status(400).json({ msg: err.message });
  }
}
