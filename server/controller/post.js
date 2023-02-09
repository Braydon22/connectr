import Post from "../model/Post.js";
import User from "../model/User.js";

//GET ALL POSTS
export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json(posts);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// GET POST
export const getPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// GET USER POST
export const getUserPost = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate("posts");
    res.status(200).json(user.posts);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// CREATE POST
export const addPost = async (req, res) => {
  try {
    const { userId } = req.params;
    const { content } = req.body;

    if (!content) res.status(400).json({ error: "missing content" });

    const user = await User.findById(userId);

    const newPost = new Post({
      author: userId,
      content: content,
      likes: 0,
    });

    user.posts = [newPost.id, ...user.posts];

    await newPost.save();
    await user.save();
    const newUser = await User.findById(userId).populate("posts");
    res.status(201).json(newUser);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

//DELETE POST
export const deletePost = async (req, res) => {
  try {
    const { userId, postId } = req.params;
    const user = await User.findById(userId);
    user.posts = user.posts.filter((id) => id.toJSON() !== postId);

    await Post.findByIdAndDelete(postId);
    await user.save();

    res.status(201).json(user.posts);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
