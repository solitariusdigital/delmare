import mongoose from "mongoose";

const dbConnect = async () =>
  mongoose.connect(process.env.NEXT_PUBLIC_MONGO_URI);

export default dbConnect;
