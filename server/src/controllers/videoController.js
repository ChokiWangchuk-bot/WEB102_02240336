const {
  videos,
  comments,
  videoLikes,
  users,
  getNextVideoId,
  getNextVideoLikeId
} = require('../models');

function parseId(param) {
  const n = Number(param);
  return Number.isFinite(n) ? n : null;
}

exports.getAllVideos = (req, res) => {
  res.json(videos);
};

exports.getVideoById = (req, res) => {
  const id = parseId(req.params.id);
  const video = videos.find((v) => v.id === id);
  if (!video) {
    return res.status(404).json({ error: 'Video not found' });
  }
  res.json(video);
};

exports.createVideo = (req, res) => {
  const { title, video_url, thumbnail_url, user_id } = req.body;
  if (!title || !video_url || user_id == null) {
    return res.status(400).json({ error: 'title, video_url, and user_id are required' });
  }
  const uid = Number(user_id);
  if (!users.some((u) => u.id === uid)) {
    return res.status(400).json({ error: 'User not found' });
  }
  const video = {
    id: getNextVideoId(),
    title,
    video_url,
    thumbnail_url: thumbnail_url || null,
    user_id: uid,
    created_at: new Date().toISOString().slice(0, 10)
  };
  videos.push(video);
  res.status(201).json(video);
};

exports.updateVideo = (req, res) => {
  const id = parseId(req.params.id);
  const video = videos.find((v) => v.id === id);
  if (!video) {
    return res.status(404).json({ error: 'Video not found' });
  }
  const { title, video_url, thumbnail_url } = req.body;
  if (title !== undefined) video.title = title;
  if (video_url !== undefined) video.video_url = video_url;
  if (thumbnail_url !== undefined) video.thumbnail_url = thumbnail_url;
  res.json(video);
};

exports.deleteVideo = (req, res) => {
  const id = parseId(req.params.id);
  const idx = videos.findIndex((v) => v.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Video not found' });
  }
  videos.splice(idx, 1);
  for (let i = comments.length - 1; i >= 0; i--) {
    if (comments[i].video_id === id) comments.splice(i, 1);
  }
  for (let i = videoLikes.length - 1; i >= 0; i--) {
    if (videoLikes[i].video_id === id) videoLikes.splice(i, 1);
  }
  res.status(204).send();
};

exports.getVideoComments = (req, res) => {
  const id = parseId(req.params.id);
  if (!videos.some((v) => v.id === id)) {
    return res.status(404).json({ error: 'Video not found' });
  }
  res.json(comments.filter((c) => c.video_id === id));
};

exports.getVideoLikes = (req, res) => {
  const id = parseId(req.params.id);
  if (!videos.some((v) => v.id === id)) {
    return res.status(404).json({ error: 'Video not found' });
  }
  res.json(videoLikes.filter((l) => l.video_id === id));
};

exports.likeVideo = (req, res) => {
  const id = parseId(req.params.id);
  if (!videos.some((v) => v.id === id)) {
    return res.status(404).json({ error: 'Video not found' });
  }
  const userId = Number(req.body.user_id);
  if (!Number.isFinite(userId)) {
    return res.status(400).json({ error: 'user_id is required' });
  }
  if (!users.some((u) => u.id === userId)) {
    return res.status(400).json({ error: 'User not found' });
  }
  const exists = videoLikes.some((l) => l.video_id === id && l.user_id === userId);
  if (exists) {
    return res.status(409).json({ error: 'Already liked' });
  }
  const like = {
    id: getNextVideoLikeId(),
    user_id: userId,
    video_id: id,
    created_at: new Date().toISOString().slice(0, 10)
  };
  videoLikes.push(like);
  res.status(201).json(like);
};

exports.unlikeVideo = (req, res) => {
  const id = parseId(req.params.id);
  if (!videos.some((v) => v.id === id)) {
    return res.status(404).json({ error: 'Video not found' });
  }
  const raw = req.body.user_id ?? req.query.user_id;
  const userId = Number(raw);
  if (!Number.isFinite(userId)) {
    return res.status(400).json({ error: 'user_id is required (body or query)' });
  }
  const idx = videoLikes.findIndex((l) => l.video_id === id && l.user_id === userId);
  if (idx === -1) {
    return res.status(404).json({ error: 'Like not found' });
  }
  videoLikes.splice(idx, 1);
  res.status(204).send();
};
