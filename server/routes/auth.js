import express from "express";
import { register, login } from "../controller/auth.js";

const router = express.Router();

//POST /auth/login
router.post("/login", login);

//POST /auth/register
router.post("/register", register);

export default router;
