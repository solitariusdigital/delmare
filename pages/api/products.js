import dbConnect from "../../services/dbConnect";
import Product from "../../models/Product";

export default async function productsHandler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=10");
  const { method } = req;
  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const products = await Product.find();
        return res.status(200).json(products);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
  }
}
