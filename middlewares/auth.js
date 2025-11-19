const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Not authorized. Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded; // contains { id: userID }
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid Token" });
  }
};

module.exports = auth;
