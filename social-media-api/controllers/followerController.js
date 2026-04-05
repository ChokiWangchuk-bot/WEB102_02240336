const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { followers } = require('../utils/mockData');

// @desc    Get all followers
// @route   GET /followers
// @access  Public
exports.getFollowers = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true, count: followers.length, data: followers });
});

// @desc    Get single follower
// @route   GET /followers/:id
// @access  Public
exports.getFollower = asyncHandler(async (req, res, next) => {
  const follower = followers.find(f => f.id === req.params.id);
  if (!follower) {
    return next(new ErrorResponse(`Follower not found with id of ${req.params.id}`, 404));
  }
  res.status(200).json({ success: true, data: follower });
});

// @desc    Follow a user
// @route   POST /followers
// @access  Private
exports.createFollower = asyncHandler(async (req, res, next) => {
  const userId = req.header('X-User-Id');
  if (!userId) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  const newFollower = {
    id: (followers.length + 1).toString(),
    follower_id: userId,
    following_id: req.body.following_id,
    created_at: new Date().toISOString().slice(0, 10)
  };

  followers.push(newFollower);
  res.status(201).json({ success: true, data: newFollower });
});

// @desc    Update follower
// @route   PUT /followers/:id
// @access  Private
exports.updateFollower = asyncHandler(async (req, res, next) => {
  const follower = followers.find(f => f.id === req.params.id);
  if (!follower) {
    return next(new ErrorResponse(`Follower not found with id of ${req.params.id}`, 404));
  }
  const index = followers.findIndex(f => f.id === req.params.id);
  followers[index] = { ...follower, ...req.body, id: follower.id };
  res.status(200).json({ success: true, data: followers[index] });
});

// @desc    Unfollow a user
// @route   DELETE /followers/:id
// @access  Private
exports.deleteFollower = asyncHandler(async (req, res, next) => {
  const follower = followers.find(f => f.id === req.params.id);
  if (!follower) {
    return next(new ErrorResponse(`Follower not found with id of ${req.params.id}`, 404));
  }
  const index = followers.findIndex(f => f.id === req.params.id);
  followers.splice(index, 1);
  res.status(200).json({ success: true, data: {} });
});
