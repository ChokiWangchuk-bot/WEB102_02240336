const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);

router.get('/:id/videos', userController.getUserVideos);

router.get('/:id/followers', userController.getFollowers);
router.post('/:id/followers', userController.followUser);
router.delete('/:id/followers', userController.unfollowUser);

router.get('/:id/following', userController.getFollowing);

router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
