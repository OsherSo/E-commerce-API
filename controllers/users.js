const getAllUsers = async (req, res) => {
  res.send('getAllUsers');
};

const getSingleUser = async (req, res) => {
  res.send('getSingleUser');
};

const showCurrentUser = async (req, res) => {
  res.send('showCurrentUser');
};

const updateUser = async (req, res) => {
  res.send('showCurrentUser');
};

const updateUserPassword = async (req, res) => {
  res.send('showCurrentUser');
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
