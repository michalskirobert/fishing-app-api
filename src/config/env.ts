import dotenv from "dotenv";

dotenv.config();

export default {
  DB_URI: process.env.DB_URI || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  PORT: process.env.PORT || 3000,
  VERSION_APP: process.env.VERSION_APP || "",
};
