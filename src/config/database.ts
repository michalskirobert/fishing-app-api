import { MongoClient, ServerApiVersion } from "mongodb";

const client = new MongoClient(process.env.DB_URI || "", {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export async function connectDatabase() {
  try {
    await client.connect();
    console.log("connected");
  } catch (error) {
    console.dir(error);
  } finally {
    await client.close();
  }
}
