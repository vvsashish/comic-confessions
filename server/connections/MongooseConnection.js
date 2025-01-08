import mongoose from "mongoose";

function connectToMongoDB(connectionUrl) {
  mongoose.connect(connectionUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const connection = mongoose.connection;
  connection.once("open", () => {
    console.log("MongoDB connection established successfully");
  });

  connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });
  return connection;
}

export default connectToMongoDB;
