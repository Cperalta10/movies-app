const express = require("express");
const cookieSession = require("cookie-session");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const googleAuth = require("./routes/googleAuth");
const userRoute = require("./routes/users");
const movieRoute = require("./routes/movies");

dotenv.config();

const PORT = 9000;

main().catch((err) => console.log(err));

async function main() {
  await mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("DB Connection Successful!");
    })
    .catch((err) => {
      console.log(err);
    });
}

app.use(express.json());

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_SECRET],
  })
);

app.use("/google", googleAuth);

app.use("/api/auth", authRoute);

app.use("/api/users", userRoute);

app.use("/api/movies", movieRoute);

app.listen(PORT, () => {
  console.log(`Server is running on: http://localhost:${PORT}`);
});
