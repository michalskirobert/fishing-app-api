// src/controllers/authController.ts
import { Request, Response } from "express";
import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "@config/env";

const client = new MongoClient(env.DB_URI);

export async function connectDatabase(name: string) {
  try {
    const resp = await client.connect();
    return resp.db(name);
  } catch (error) {
    console.error(error);
  }
}

export const signUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const db = await connectDatabase("usersDB");
    const usersCollection = db?.collection("users");

    const existingUser = await usersCollection?.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await usersCollection?.insertOne({
      email,
      password: hashedPassword,
    });

    if (result?.insertedId) {
      res.status(201).json({ message: "User created successfully" });
    } else {
      res.status(500).json({ message: "User creation failed" });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        message:
          "Ogólny błąd serwera, proszę skontaktować się z administratorem",
      });
  }
};

export const signIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const db = await connectDatabase("usersDB");
    const usersCollection = db?.collection("users");

    const user = await usersCollection?.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ token });
  } catch (error) {
    res
      .status(500)
      .json({
        message:
          "Ogólny błąd serwera, proszę skontaktować się z administratorem",
      });
  }
};
