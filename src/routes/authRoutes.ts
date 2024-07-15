import express from "express";
import { signUp, signIn, token } from "@controllers/authController";

const router = express.Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.post("/token", token);

export default router;
