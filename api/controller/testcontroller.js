const jwt = require("jsonwebtoken");

const shouldBeLoggedIn = async (req, res) => {
  console.log("userid", req.userId);
  res.status(200).json({ message: "You are Authenticated" });
};

const shouldBeAdmin = async (req, res) => {
  if (!req.isAdmin) {
    return res.status(403).json({ message: "Not Authorized" });
  }
  res.status(200).json({ message: "You are Authenticated as Admin" });
};

module.exports = {
  shouldBeLoggedIn,
  shouldBeAdmin,
};
