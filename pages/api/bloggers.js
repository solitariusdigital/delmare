import Blogger from "../../models/Blogger";
import dbConnect from "../../services/dbConnect";

export default async function bloggersHandler(req, res) {
  const { method, body } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const bloggers = await Blogger.find();
        return res.status(200).json(bloggers);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
    case "PUT":
      try {
        const updateBlogger = await Blogger.findByIdAndUpdate(
          body["_id"],
          body,
          {
            new: true,
            runValidators: true,
          }
        );
        if (!updateBlogger) {
          return res.status(400).json({ msg: err.message });
        }
        return res.status(200).json(updateBlogger);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
  }
}
