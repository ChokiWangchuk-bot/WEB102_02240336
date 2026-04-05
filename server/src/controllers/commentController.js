const {
  comments,
  videos,
  users,
  commentLikes,
  getNextCommentId,
  getNextCommentLikeId
} = require('../models');

function parseId(param) {
  const n = Number(param);
  return Number.isFinite(n) ? n : null;
}

exports.getAllComments = (req, res) => {
  res.json(comments);
};

exports.getCommentById = (req, res) => {
  const id = parseId(req.params.id);
  const comment = comments.find((c) => c.id === id);
  if (!comment) {
    return res.status(404).json({ error: 'Comment not found' });
  }
  res.json(comment);
};

exports.createComment = (req, res) => {
  const { text, user_id, video_id } = req.body;
  if (!text || user_id == null || video_id == null) {
    return res.status(400).json({ error: 'text, user_id, and video_id are required' });
  }
  const uid = Number(user_id);
  const vid = Number(video_id);
  if (!users.some((u) => u.id === uid)) {
    return res.status(400).json({ error: 'User not found' });
  }
  if (!videos.some((v) => v.id === vid)) {
    return res.status(400).json({ error: 'Video not found' });
  }
  const comment = {
    id: getNextCommentId(),
    text,
    user_id: uid,
    video_id: vid,
    created_at: new Date().toISOString().slice(0, 10)
  };
  comments.push(comment);
  res.status(201).json(comment);
};

exports.updateComment = (req, res) => {
  const id = parseId(req.params.id);
  const comment = comments.find((c) => c.id === id);
  if (!comment) {
    return res.status(404).json({ error: 'Comment not found' });
  }
  const { text } = req.body;
  if (text !== undefined) comment.text = text;
  res.json(comment);
};

exports.deleteComment = (req, res) => {
  const id = parseId(req.params.id);
  const idx = comments.findIndex((c) => c.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Comment not found' });
  }
  comments.splice(idx, 1);
  for (let i = commentLikes.length - 1; i >= 0; i--) {
    if (commentLikes[i].comment_id === id) commentLikes.splice(i, 1);
  }
  res.status(204).send();
};

exports.getCommentLikes = (req, res) => {
  const id = parseId(req.params.id);
  if (!comments.some((c) => c.id === id)) {
    return res.status(404).json({ error: 'Comment not found' });
  }
  res.json(commentLikes.filter((l) => l.comment_id === id));
};

exports.likeComment = (req, res) => {
  const id = parseId(req.params.id);
  if (!comments.some((c) => c.id === id)) {
    return res.status(404).json({ error: 'Comment not found' });
  }
  const userId = Number(req.body.user_id);
  if (!Number.isFinite(userId)) {
    return res.status(400).json({ error: 'user_id is required' });
  }
  if (!users.some((u) => u.id === userId)) {
    return res.status(400).json({ error: 'User not found' });
  }
  const exists = commentLikes.some((l) => l.comment_id === id && l.user_id === userId);
  if (exists) {
    return res.status(409).json({ error: 'Already liked' });
  }
  const like = {
    id: getNextCommentLikeId(),
    user_id: userId,
    comment_id: id,
    created_at: new Date().toISOString().slice(0, 10)
  };
  commentLikes.push(like);
  res.status(201).json(like);
};

exports.unlikeComment = (req, res) => {
  const id = parseId(req.params.id);
  if (!comments.some((c) => c.id === id)) {
    return res.status(404).json({ error: 'Comment not found' });
  }
  const raw = req.body.user_id ?? req.query.user_id;
  const userId = Number(raw);
  if (!Number.isFinite(userId)) {
    return res.status(400).json({ error: 'user_id is required (body or query)' });
  }
  const idx = commentLikes.findIndex((l) => l.comment_id === id && l.user_id === userId);
  if (idx === -1) {
    return res.status(404).json({ error: 'Like not found' });
  }
  commentLikes.splice(idx, 1);
  res.status(204).send();
};
