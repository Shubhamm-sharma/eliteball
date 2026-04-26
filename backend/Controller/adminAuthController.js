const {
  DEFAULT_ADMIN_EMAIL,
  DEFAULT_ADMIN_PASSWORD,
  getAdminCredentials,
  signAdminToken,
} = require("../Services/adminAuth.service");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const adminCredentials = getAdminCredentials();

    if (
      email !== adminCredentials.email ||
      password !== adminCredentials.password
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin email or password",
      });
    }

    const token = signAdminToken({
      role: "admin",
      email: adminCredentials.email,
    });

    res.json({
      success: true,
      data: {
        token,
        user: {
          email: adminCredentials.email,
          role: "admin",
        },
        defaults: {
          email: DEFAULT_ADMIN_EMAIL,
          password: DEFAULT_ADMIN_PASSWORD,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
