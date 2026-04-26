const { verifyAdminToken } = require("../Services/adminAuth.service");

exports.adminAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No admin token provided" });
  }

  try {
    const decoded = verifyAdminToken(token);
    if (decoded.role !== "admin")
      return res
        .status(403)
        .json({ success: false, message: "Admins only" });
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid admin token" });
  }
};
