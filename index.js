import express from "express";
import cors from "cors";
//Env Config
import "dotenv/config";

//Database Dependency
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
const app = express();

//Middlewares
app.use(cors());
app.use(express.json());

//Server Port
const port = process.env.PORT || 3000;

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
    await client.connect();

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
      console.log(data);
      const result = await brandShopUserCollection.insertOne(data);
      res.send(result);
    });

    //Sending Product Data to Database
    app.post("/api/addProduct", async (req, res) => {
      const productData = req.body;
      console.log(productData);
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

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello From Express!");
});

//Server Starting Script
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
