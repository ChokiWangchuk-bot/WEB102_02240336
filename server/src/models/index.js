let nextUserId = 4;
let nextVideoId = 4;
let nextCommentId = 4;
let nextVideoLikeId = 4;
let nextCommentLikeId = 4;
let nextFollowId = 4;

const users = [
  {
    id: 1,
    username: 'traveler',
    email: 'traveler@example.com',
    full_name: 'Karma',
    profile_picture: 'https://example.com/profiles/traveler.jpg',
    bio: 'Travel photographer',
    created_at: '2023-01-15'
  },
  {
    id: 2,
    username: 'foodie',
    email: 'foodie@example.com',
    full_name: 'Alex Chen',
    profile_picture: 'https://example.com/profiles/foodie.jpg',
    bio: 'Food lover and chef',
    created_at: '2023-02-20'
  },
  {
    id: 3,
    username: 'techguru',
    email: 'techguru@example.com',
    full_name: 'Sam Johnson',
    profile_picture: 'https://example.com/profiles/techguru.jpg',
    bio: 'Tech enthusiast',
    created_at: '2023-03-10'
  }
];

const videos = [
  {
    id: 1,
    title: 'Beautiful sunset at the beach!',
    video_url: 'https://example.com/videos/sunset.mp4',
    thumbnail_url: 'https://example.com/posts/sunset.jpg',
    user_id: 1,
    created_at: '2023-04-01'
  },
  {
    id: 2,
    title: 'Trying out this amazing new restaurant!',
    video_url: 'https://example.com/videos/food.mp4',
    thumbnail_url: 'https://example.com/posts/food.jpg',
    user_id: 2,
    created_at: '2023-04-05'
  },
  {
    id: 3,
    title: 'Just got the latest smartphone!',
    video_url: 'https://example.com/videos/phone.mp4',
    thumbnail_url: 'https://example.com/posts/phone.jpg',
    user_id: 3,
    created_at: '2023-04-10'
  }
];

const comments = [
  {
    id: 1,
    text: 'Amazing video!',
    user_id: 2,
    video_id: 1,
    created_at: '2023-04-02'
  },
  {
    id: 2,
    text: 'Looks delicious!',
    user_id: 1,
    video_id: 2,
    created_at: '2023-04-06'
  },
  {
    id: 3,
    text: 'Which model is that?',
    user_id: 2,
    video_id: 3,
    created_at: '2023-04-11'
  }
];

const videoLikes = [
  { id: 1, user_id: 2, video_id: 1, created_at: '2023-04-02' },
  { id: 2, user_id: 3, video_id: 1, created_at: '2023-04-03' },
  { id: 3, user_id: 1, video_id: 2, created_at: '2023-04-06' }
];

const commentLikes = [
  { id: 1, user_id: 1, comment_id: 1, created_at: '2023-04-02' },
  { id: 2, user_id: 3, comment_id: 1, created_at: '2023-04-03' }
];

const follows = [
  { id: 1, follower_id: 2, following_id: 1, created_at: '2023-03-01' },
  { id: 2, follower_id: 3, following_id: 1, created_at: '2023-03-05' },
  { id: 3, follower_id: 1, following_id: 2, created_at: '2023-03-10' }
];

function getNextUserId() {
  return nextUserId++;
}

function getNextVideoId() {
  return nextVideoId++;
}

function getNextCommentId() {
  return nextCommentId++;
}

function getNextVideoLikeId() {
  return nextVideoLikeId++;
}

function getNextCommentLikeId() {
  return nextCommentLikeId++;
}

function getNextFollowId() {
  return nextFollowId++;
}

module.exports = {
  users,
  videos,
  comments,
  videoLikes,
  commentLikes,
  follows,
  getNextUserId,
  getNextVideoId,
  getNextCommentId,
  getNextVideoLikeId,
  getNextCommentLikeId,
  getNextFollowId
};
