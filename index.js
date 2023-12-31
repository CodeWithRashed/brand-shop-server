import express from "express";
const app = express();
import cors from "cors";
//Env Config
import "dotenv/config";


//Database Dependency
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
const port = process.env.PORT || 3000;

//Middlewares
app.use(cors());
app.use(express.json());

//Server Port

//Database Connection
//URI
const uri = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.h9t3k.mongodb.net/?retryWrites=true&w=majority`;

//Database Client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

//Database Connect Function
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
   

    //Connect To Cluster Database
    const brandShopDB = client.db("brandShop");
    //User Collection
    const brandShopUserCollection = brandShopDB.collection("users");
    //Products Collection
    const productCollection = brandShopDB.collection("shopProducts");

    //Cart Item Collections
    const cartCollection = brandShopDB.collection("cartItems");

    app.post("/api/addUser", async (req, res) => {
      const data = req.body;
      const result = await brandShopUserCollection.insertOne(data);
      res.send(result);
    });

    //Sending Product Data to Database
    app.post("/api/addProduct", async (req, res) => {
      const productData = req.body;
      const result = await productCollection.insertOne(productData);
      res.send(result);
    });

    //getting products data form database
    app.get("/api/getProduct", async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //getting single product data form database
    app.get("/api/getProduct/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });

    //add cart items to database
    app.post("/api/addCartItem", async (req, res) => {
      const cartItem = req.body;
      const result = await cartCollection.insertOne(cartItem);
      res.send(result);
    });

    //sending cart product to user
    app.get("/api/getCartItems", async (req, res) => {
      const cursor = cartCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //delete cart product to user
    app.delete("/api/delete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { id: id };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });

    app.put("/api/update/:id", async (req, res) => {
      const id = req.params.id;
      const changeProduct = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };

      const updateProduct = {
        $set: {
          productName: changeProduct.productName,
          productImage: changeProduct.productImage,
          brandName: changeProduct.brandName,
          productType: changeProduct.productType,
          productPrice: changeProduct.productPrice,
          productRatting: changeProduct.productRatting,
          productDescription: changeProduct.productDescription,
        },
      };
      const result = await productCollection.updateOne(
        filter,
        updateProduct,
        options
      );
      res.send(result);
    });

 } finally {
  ""
  }
}
run()

app.get("/", (req, res) => {
  res.send("Hello From Express!");
});

//Server Starting Script
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
