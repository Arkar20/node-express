const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
app.use(morgan("tiny"));

require("dotenv/config");

//connecting mongodb
mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("Connection Successful"))
  .catch((err) => console.log(err));

const { Schema } = mongoose;

const blogSchema = new Schema({
  title: String, // String is shorthand for {type: String}
});

const Post = mongoose.model("Blog", blogSchema);

app.use(express.json());
app.post("/blog/create", async (req, res) => {
  const { title } = req.body;
  const post = new Post({ title });
  const result = await post.save();
  if (result) {
    return res.json(result);
  }
});

app.listen(3030, () => {
  console.log("Server is running at port 3030");
});
