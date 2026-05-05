import jwt from "jsonwebtoken";

export const loginAdmin = (req, res) => {
  const { email, password } = req.body;

  // check static credentials
  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  // generate token
  const token = jwt.sign(
    { role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "3h" }
  );

  return res.json({
    success: true,
    token,
  });
};