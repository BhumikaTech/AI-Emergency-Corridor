const getProfile = (req, res) => {
  res.status(200).json({
    message: "Authentication successful",
    user: req.user
  });
};

module.exports = {
  getProfile
};