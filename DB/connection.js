import mongoose from "mongoose";

export const connection = async () => {
  return await mongoose
    .connect(process.env.DB_URI)
    .then(console.log("DB connected"))
    .catch((err) => console.log(err, "DB connection Failed"));
};
