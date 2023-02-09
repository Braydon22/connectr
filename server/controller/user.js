import User from "../model/User.js";

// GET USERS
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
};

// GET USER
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) return res.status(404).json({ error: "user not found" });
    res.status(200).json(user);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
};

//GET USER FRIENDS
export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate("friends");

    res.status(200).json(user.friends);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
};

//Update Friends
export const addOrRemoveFriends = async (req, res) => {
  try {
    const { curUserId, friendId } = req.params;
    const user = await User.findById(curUserId);
    const friend = await User.findById(friendId);

    if (!friend) return res.status(404).json({ error: "user not exist" });

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id.toJSON() !== friendId);
      friend.friends = friend.friends.filter((id) => id.toJSON() !== curUserId);
    } else {
      user.friends = [friendId, ...user.friends];
      friend.friends = [curUserId, ...friend.friends];
    }

    await user.save();
    await friend.save();

    const newUser = await User.findById(curUserId).populate("friends");
    res.status(201).json(newUser.friends);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

//GET FOLLOWERS
export const getFollowers = async (req, res) => {
  try {
    const { id } = req.params;
    const user = User.findById(id).populate("followers");
    res.status(200).json(user.followers);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// UPDATE, FOLLOW / UNFOLLOW USERS
export const followOrUnfollow = async (req, res) => {
  try {
    const { curUserId, targetUserId } = req.params;
    const user = await User.findById(curUserId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) return res.status(404).json({ error: "user not found" });

    if (user.following.includes(targetUserId)) {
      user.following = user.following.filter(
        (id) => id.toJSON() !== targetUserId
      );
      targetUser.followers = targetUser.followers.filter(
        (id) => id.toJSON() !== curUserId
      );
    } else {
      user.following = [targetUserId, ...user.following];
      targetUser.followers = [curUserId, ...targetUser.followers];
    }

    await user.save();

    await targetUser.save();

    const newUser = await User.findById(curUserId).populate("following");
    res.status(201).json(newUser.following);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
