const jwt = require("jsonwebtoken");

module.exports = (roles) => {
  return (req, res, next) => {
    if (req.method === "OPTIONS") {
      return next();
    }
    try {
      const token = req.headers.authorization.split(" ")[1]; // "Bearer TOKEN"
      if (!token) {
        return res.status(401).json({ message: "No authorization" });
      }

      const { role } = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

      let hasRole = false;

      if (roles.includes(role)) {
        hasRole = true;
      }

      if (!hasRole) {
        return res
          .status(403)
          .json({ message: "The role does not have access" });
      }

      next();
    } catch (e) {
      res.status(401).json({ message: `No authorization error ${e}` });
    }
  };
};
