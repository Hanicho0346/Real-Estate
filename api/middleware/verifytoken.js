const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  let token;
 
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } 

  else if (req.cookies?.token) {
    token = req.cookies.token;
  }
  
  // console.log("Headers:", req.headers); 
  // console.log("Cookies:", req.cookies);

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  jwt.verify(token, process.env.JWT_KEY_TOKEN, (err, payload) => {
    if (err) {
      console.error("Token verification error:", {
        name: err.name,
        message: err.message,
        expiredAt: err.expiredAt,
      });
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.userId = payload.id;
    next();
  });
};

module.exports = verifyToken;