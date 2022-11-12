import Invoice from "../../models/Invoice";
import dbConnect from "../../services/dbConnect";

export default async function invoiceHandler(req, res) {
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
  }
}
