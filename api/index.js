const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const PORT = 9000;

app.use(express.json());

main().catch((err) => console.log(err));

async function main() {
  await mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("DB Connection Successful!");
    })
    .catch((err) => {
      console.log(err);
    });
}

app.listen(PORT, () => {
  console.log(`Server is running on: http://localhost:${PORT}`);
});
