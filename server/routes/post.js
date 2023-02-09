import express from "express";
import {
  getUserPost,
  addPost,
  getPost,
  deletePost,
  getAllPost,
} from "../controller/post.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

//READ
router.get("/", getAllPost);
router.get("/:postId", verifyToken, getPost);
router.get("/userposts/:userId", verifyToken, getUserPost);

//POST
router.post("/:userId", verifyToken, addPost);

//DELETE
router.delete("/:userId/:postId", verifyToken, deletePost);

export default router;
