import { connect, connection } from "mongoose";

const conn = {
  isConneted: false,
};

async function dbConnect() {
  if (conn.isConneted) return;

  const db = await connect(process.env.MONGO_URI, {
    authSource: "admin",
  });
  conn.isConneted = db.connections[0].readyState;

  console.log(db.connection.db.databaseName);
}

connection.on("connected", () => {
  console.log("MongoDB connected to DB");
});

connection.on("error", (error) => {
  console.log("MongoDB error", error.message);
});

export default dbConnect;
