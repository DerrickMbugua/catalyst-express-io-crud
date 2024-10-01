const express = require("express");
const {
  getAllProducts,
  saveProduct,
  updateProduct,
  deleteProduct,
} = require("./controller/productController.js");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from crud");
});

app.get("/products", getAllProducts);
app.post("/products/create", saveProduct);
app.put("/products/update/:ROWID", updateProduct);
app.delete("/products/delete/:ROWID", deleteProduct);

module.exports = app;
