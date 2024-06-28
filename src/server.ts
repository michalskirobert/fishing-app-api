import express from "express";
import fishingSpotsRoutes from "./routes/fishingSpotsRoutes";

import { MongoClient, ServerApiVersion } from "mongodb";

import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const client = new MongoClient(process.env.DB_URI || "", {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

app.use(express.json());

app.use("/fishing-spots", fishingSpotsRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
