const catalyst = require("zcatalyst-sdk-node");

const getAllProducts = async (req, res) => {
  try {
    // Initialize Catalyst SDK using the request object
    const catalystApp = catalyst.initialize(req);

    // Fetch products from Catalyst datastore using ZCQL query
    const products = await getDataFromCatalystDataStore(catalystApp);

    if (products.length === 0) {
      res.status(404).send({
        status: "failure",
        message: "No products found",
      });
    } else {
      res.status(200).send({
        status: "success",
        data: {
          products,
        },
      });
    }
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).send({
      status: "failure",
      message: "We're unable to process the request.",
    });
  }
};

const saveProduct = async (req, res) => {
  try {
    const catalystApp = catalyst.initialize(req);
    const { name, description, price } = req.body;

    const table = catalystApp.datastore().table("Products");
    const { ROWID: id } = await table.insertRow({
      name: name,
      description: description,
      price: price,
    });

    res.status(200).send({
      status: "success",
      data: {
        product: {
          id,
          name,
          description,
          price,
        },
      },
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).send({
      status: "failure",
      message: "We're unable to process the request.",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const catalystApp = catalyst.initialize(req);
    const { ROWID } = req.params;
    const { name, description, price } = req.body;

    const table = catalystApp.datastore().table("Products");
    const updatedRowData = {
      name: name,
      description: description,
      price: price,
      ROWID: ROWID,
    };
    await table.updateRow(updatedRowData);

    res.status(200).send({
      status: "success",
      data: {
        product: {
          id: ROWID,
          name,
          description,
          price,
        },
      },
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).send({
      status: "failure",
      message: "We're unable to process the request.",
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const catalystApp = catalyst.initialize(req);
    const { ROWID } = req.params;

    const table = catalystApp.datastore().table("Products");

    await table.deleteRow(ROWID)

    res.status(200).send({
      status: "Delete Success",
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).send({
      status: "failure",
      message: "We're unable to process the request.",
    });
  }
};

// Helper function to query the datastore using ZCQL
function getDataFromCatalystDataStore(catalystApp) {
  return new Promise((resolve, reject) => {
    const zcql = catalystApp.zcql();

    zcql
      .executeZCQLQuery("SELECT * FROM Products LIMIT 10") // Add a limit to the query
      .then((queryResponse) => {
        resolve(queryResponse);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

module.exports = {
  getAllProducts,
  saveProduct,
  updateProduct,
  deleteProduct
};
