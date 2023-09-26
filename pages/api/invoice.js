import Invoice from "../../models/Invoice";
import dbConnect from "../../services/dbConnect";

export default async function invoicesHandler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=10");
  const { method, body } = req;

  await dbConnect();

  switch (method) {
    case "POST":
      try {
        const newInvoice = await Invoice.create(body);
        return res.status(200).json(newInvoice);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
    case "GET":
      try {
        const invoices = await Invoice.find();
        return res.status(200).json(invoices);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
    case "PUT":
      try {
        const updateInvoice = await Invoice.findByIdAndUpdate(
          body["_id"],
          body,
          {
            new: true,
            runValidators: true,
          }
        );
        if (!updateInvoice) {
          return res.status(400).json({ msg: err.message });
        }
        return res.status(200).json(updateInvoice);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
  }
}
