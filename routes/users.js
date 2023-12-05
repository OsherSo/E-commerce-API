const express = require('express');

const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require('../controllers/users');

const { authUser, authPermissions } = require('../middleware/auth');

const router = express.Router();

router.route('/').get(authUser, authPermissions('admin'), getAllUsers);

router.route('/showMe').get(showCurrentUser);
router.route('/updateUser').patch(updateUser);
router.route('/updateUserPassword').patch(updateUserPassword);

router.route('/:id').get(authUser, getSingleUser);

module.exports = router;
