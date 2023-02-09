import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";
import { PORT, MONGO_URL } from "./utils/config.js";
import { info, error } from "./utils/logger.js";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import postRouter from "./routes/post.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("common"));

// routes
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/post", postRouter);

// mongo setup
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => info(`server running on port ${PORT}`));
  })
  .catch((e) => {
    error(`mongo connection error: ${e.message}`);
  });
