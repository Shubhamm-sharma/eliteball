const jwt = require("jsonwebtoken");

const DEFAULT_JWT_SECRET = "insport-local-admin-secret";
const DEFAULT_ADMIN_EMAIL = "admin@insport.local";
const DEFAULT_ADMIN_PASSWORD = "admin12345";

const getJwtSecret = () => process.env.JWT_SECRET || DEFAULT_JWT_SECRET;

const getAdminCredentials = () => ({
  email: process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD,
});

const signAdminToken = (payload) =>
  jwt.sign(payload, getJwtSecret(), {
    expiresIn: "12h",
  });

const verifyAdminToken = (token) => jwt.verify(token, getJwtSecret());

module.exports = {
  DEFAULT_ADMIN_EMAIL,
  DEFAULT_ADMIN_PASSWORD,
  getAdminCredentials,
  getJwtSecret,
  signAdminToken,
  verifyAdminToken,
};
