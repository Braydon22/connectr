import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/User.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "incificient user details" });
    }

    const userExist = await User.findOne({ username: username });
    if (userExist) {
      return res.status(400).json({
        error: "username taken",
      });
    }

    const saltRound = 10;
    const passwordHash = await bcrypt.hash(password, saltRound);

    const user = new User({
      username,
      email,
      passwordHash,
    });

    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "missing user details" });

    const user = await User.findOne({ email: email });
    const match = user && (await bcrypt.compare(password, user.passwordHash));
    if (!match) return res.status(400).json({ error: "invalid credential" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.status(200).json({ token, user });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
