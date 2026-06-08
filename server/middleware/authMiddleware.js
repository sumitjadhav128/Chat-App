const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {

    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({
        msg: "No token provided"
      });
    }

    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = verified;

    console.log("Decoded user:", verified);

    next();

  } catch (error) {

    return res.status(401).json({
      msg: "Invalid token"
    });

  }
};

module.exports = authMiddleware;