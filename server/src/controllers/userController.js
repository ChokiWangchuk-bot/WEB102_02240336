const {
  users,
  videos,
  follows,
  getNextUserId,
  getNextFollowId
} = require('../models');

function parseId(param) {
  const n = Number(param);
  return Number.isFinite(n) ? n : null;
}

exports.getAllUsers = (req, res) => {
  res.json(users);
};

exports.getUserById = (req, res) => {
  const id = parseId(req.params.id);
  const user = users.find((u) => u.id === id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
};

exports.createUser = (req, res) => {
  const { username, email, full_name, profile_picture, bio } = req.body;
  if (!username || !email) {
    return res.status(400).json({ error: 'username and email are required' });
  }
  const user = {
    id: getNextUserId(),
    username,
    email,
    full_name: full_name || '',
    profile_picture: profile_picture || '',
    bio: bio || '',
    created_at: new Date().toISOString().slice(0, 10)
  };
  users.push(user);
  res.status(201).json(user);
};

exports.updateUser = (req, res) => {
  const id = parseId(req.params.id);
  const user = users.find((u) => u.id === id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const { username, email, full_name, profile_picture, bio } = req.body;
  if (username !== undefined) user.username = username;
  if (email !== undefined) user.email = email;
  if (full_name !== undefined) user.full_name = full_name;
  if (profile_picture !== undefined) user.profile_picture = profile_picture;
  if (bio !== undefined) user.bio = bio;
  res.json(user);
};

exports.deleteUser = (req, res) => {
  const id = parseId(req.params.id);
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  users.splice(idx, 1);
  res.status(204).send();
};

exports.getUserVideos = (req, res) => {
  const id = parseId(req.params.id);
  if (!users.some((u) => u.id === id)) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(videos.filter((v) => v.user_id === id));
};

exports.getFollowers = (req, res) => {
  const id = parseId(req.params.id);
  if (!users.some((u) => u.id === id)) {
    return res.status(404).json({ error: 'User not found' });
  }
  const followerIds = follows.filter((f) => f.following_id === id).map((f) => f.follower_id);
  res.json(users.filter((u) => followerIds.includes(u.id)));
};

exports.followUser = (req, res) => {
  const id = parseId(req.params.id);
  if (!users.some((u) => u.id === id)) {
    return res.status(404).json({ error: 'User not found' });
  }
  const followerId = Number(req.body.follower_id);
  if (!Number.isFinite(followerId)) {
    return res.status(400).json({ error: 'follower_id is required' });
  }
  if (!users.some((u) => u.id === followerId)) {
    return res.status(400).json({ error: 'Follower user not found' });
  }
  if (followerId === id) {
    return res.status(400).json({ error: 'Cannot follow yourself' });
  }
  const exists = follows.some((f) => f.follower_id === followerId && f.following_id === id);
  if (exists) {
    return res.status(409).json({ error: 'Already following' });
  }
  const row = {
    id: getNextFollowId(),
    follower_id: followerId,
    following_id: id,
    created_at: new Date().toISOString().slice(0, 10)
  };
  follows.push(row);
  res.status(201).json(row);
};

exports.unfollowUser = (req, res) => {
  const id = parseId(req.params.id);
  if (!users.some((u) => u.id === id)) {
    return res.status(404).json({ error: 'User not found' });
  }
  const raw = req.body.follower_id ?? req.query.follower_id;
  const followerId = Number(raw);
  if (!Number.isFinite(followerId)) {
    return res.status(400).json({ error: 'follower_id is required (body or query)' });
  }
  const idx = follows.findIndex((f) => f.follower_id === followerId && f.following_id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Follow relationship not found' });
  }
  follows.splice(idx, 1);
  res.status(204).send();
};

exports.getFollowing = (req, res) => {
  const id = parseId(req.params.id);
  if (!users.some((u) => u.id === id)) {
    return res.status(404).json({ error: 'User not found' });
  }
  const followingIds = follows.filter((f) => f.follower_id === id).map((f) => f.following_id);
  res.json(users.filter((u) => followingIds.includes(u.id)));
};
