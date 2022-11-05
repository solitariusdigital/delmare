import AWS from "aws-sdk";
import fs from "fs";
import formidable from "formidable";
import Product from "../../models/Product";
import dbConnect from "../../services/dbConnect";
import { v4 as uuidv4 } from "uuid";

const AWSconfig = {
  endpoint: process.env.LIARA_ENDPOINT,
  accessKeyId: process.env.LIARA_ACCESS_KEY,
  secretAccessKey: process.env.LIARA_SECRET_KEY,
  region: "default",
};

const client = new AWS.S3(AWSconfig);
client.listBuckets((err, data) => {
  if (err) console.error(err, err.stack);
  else console.log(data);
});

export const config = {
  api: { bodyParser: false },
};

export default async function product(req, res) {
  const form = formidable();
  form.parse(req, async (err, fields, files) => {
    if (!files.main) {
      return res.status(400).send("No file uploaded");
    }
    console.log(files.main.originalFilename);

    try {
      let fileName = files.main.originalFilename.split(" ").join("");
      let imageId = uuidv4();

      await dbConnect();

      await Product.create({
        imageId: imageId,
        title: fileName,
        link: `https://delmare.storage.iran.liara.space/${imageId}`,
        description: "something",
      });

      return client.putObject(
        {
          Bucket: process.env.LIARA_BUCKET_NAME,
          Key: `${imageId}.jpg`,
          Body: fs.createReadStream(files.main.filepath),
          ACL: "public-read",
        },
        async () => res.status(201).json("Success")
      );
    } catch (e) {
      console.log(e);
      res.status(500).send("Error");
    }
  });
}
