const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
app.use(morgan("tiny"));
const authJwt = require("./helper/authJwt");

require("dotenv/config");

//connecting mongodb
mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("Connection Successful"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(authJwt());

const errorHandler = require("./helper/errorHandler");
app.use(errorHandler);

//users routes:
app.use("/user", require("./routes/user"));

app.use("/product", require("./routes/product"));

//category routes
app.use("/category", require("./routes/category"));

app.listen(3030, () => {
  console.log("Server is running at port 3030");
});
