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

// Helper function to query the datastore using ZCQL
function getDataFromCatalystDataStore(catalystApp) {
    return new Promise((resolve, reject) => {
        const zcql = catalystApp.zcql();

        zcql.executeZCQLQuery("SELECT * FROM Products LIMIT 10") // Add a limit to the query
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
};
