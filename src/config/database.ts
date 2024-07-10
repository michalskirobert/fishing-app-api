import { MongoClient } from "mongodb";
import env from "@config/env";
import { DatabaseProps } from "@namespace/database";

const client = new MongoClient(env.DB_URI);

export async function connectDatabase(name: DatabaseProps) {
  try {
    const resp = await client.connect();
    return resp.db(name);
  } catch (error) {
    console.error(error);
  }
}
