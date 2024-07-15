import { Request, Response } from "express";
import { connectDatabase } from "@config/database";

import bcrypt from "bcrypt";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import env from "@config/env";

export const signUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, permitNo, pesel, birthDate } = req.body;
    const db = await connectDatabase("auth");
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
      permitNo,
      pesel,
      birthDate,
    });

    if (result?.insertedId) {
      res.status(201).json({ message: "User created successfully" });
    } else {
      res.status(500).json({ message: "User creation failed" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Ogólny błąd serwera, proszę skontaktować się z administratorem",
    });
  }
};

export const signIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const db = await connectDatabase("auth");
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

    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ ...user, accessToken });
  } catch (error) {
    res.status(500).json({
      message: "Ogólny błąd serwera, proszę skontaktować się z administratorem",
    });
  }
};

export const token = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body;

    if (typeof token !== "string") {
      res.status(400).json({
        message: "Nieprawidłowe dane żądania. Token musi być ciągiem znaków.",
      });
      return;
    }

    // Verify the token
    jwt.verify(
      token,
      env.JWT_SECRET,
      (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
        if (err) {
          // If token is invalid or expired
          return res.status(401).json({
            message:
              "Token jest nieprawidłowy lub wygasł, proszę zalogować się ponownie.",
          });
        }

        if (typeof decoded === "string" || !decoded) {
          return res.status(401).json({
            message: "Payload tokenu jest nieprawidłowy.",
          });
        }

        const currentDate = new Date();
        const exp = (decoded as JwtPayload).exp;
        if (!exp) {
          return res.status(401).json({
            message: "Data wygaśnięcia tokenu jest brakująca.",
          });
        }

        const tokenExpireDate = new Date(exp * 1000); // Convert exp to milliseconds

        // Check if the token is about to expire in the next 5 minutes
        const fiveMinutesInMs = 5 * 60 * 1000;
        if (
          tokenExpireDate.getTime() - currentDate.getTime() <=
          fiveMinutesInMs
        ) {
          // Generate a new token
          const newToken = jwt.sign({ data: decoded }, env.JWT_SECRET, {
            expiresIn: "1h", // Adjust expiration time as needed
          });

          // Respond with the new token
          return res.status(200).json({
            message: "Token wkrótce wygaśnie, oto nowy token.",
            token: newToken,
          });
        }

        // If token is still valid and not about to expire
        res.status(200).json({
          message: "Token jest ważny.",
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      message:
        "Ogólny błąd serwera, proszę skontaktować się z administratorem.",
    });
  }
};
