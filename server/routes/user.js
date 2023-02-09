import express from "express";
import {
  getUsers,
  getUser,
  getUserFriends,
  addOrRemoveFriends,
  followOrUnfollow,
  getFollowers,
} from "../controller/user.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

//READ
router.get("/", getUsers);
router.get("/:id", getUser);
router.get("/:id/friends", getUserFriends);
router.get("/:id", getFollowers);

//UPDATE
router.patch("/friend/:curUserId/:friendId", verifyToken, addOrRemoveFriends);
router.patch("/follow/:curUserId/:targetUserId", verifyToken, followOrUnfollow);

export default router;
