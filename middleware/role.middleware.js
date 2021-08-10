const jwt = require("jsonwebtoken");
const config = require("config");

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

      const { role } = jwt.verify(token, config.get("jwtSecret"));
      console.log(role, "role");
      console.log(roles, "roles");

      let hasRole = false;

      if (roles.includes(role)) {
        hasRole = true;
      }

      if (!hasRole) {
        return res.status(403).json({ message: "Role does not access" });
      }

      next();
    } catch (e) {
      res.status(401).json({ message: `No authorization error ${e}` });
    }
  };
};
