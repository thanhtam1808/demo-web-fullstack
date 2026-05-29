import { Router } from "express";
import jwt from "jsonwebtoken";
import Account from "../models/Account.js";
import Customer from "../models/Customer.js";
import { auth } from "../middleware/auth.js";
import SECRET from "../config.js";

const router = Router();
const sign = (payload) => jwt.sign(payload, SECRET, { expiresIn: "7d" });

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;
    if (!email || !password || !name)
      return res
        .status(400)
        .json({ message: "Vui lòng điền đầy đủ email, mật khẩu và tên" });

    if (await Account.findOne({ email }))
      return res.status(400).json({ message: "Email này đã được đăng ký" });

    const account = await Account.create({ email, password });
    const customer = await Customer.create({
      name,
      phone: phone || "",
      accountId: account._id,
    });

    res.status(201).json({
      message: "Đăng ký thành công!",
      user: { id: account._id, email, role: account.role, name: customer.name },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const account = await Account.findOne({ email });
    if (!account)
      return res
        .status(400)
        .json({ message: "Email hoặc mật khẩu không đúng" });
    if (!account.isActive)
      return res.status(403).json({ message: "Tài khoản đã bị khoá" });
    if (!(await account.comparePassword(password)))
      return res
        .status(400)
        .json({ message: "Email hoặc mật khẩu không đúng" });

    const profile = await Customer.findOne({ accountId: account._id });
    const token = sign({
      id: account._id,
      role: account.role,
      profileId: profile?._id,
      name: profile?.name || "",
      email: account.email,
    });

    res.json({
      token,
      user: {
        id: account._id,
        email: account.email,
        role: account.role,
        name: profile?.name || "",
        profileId: profile?._id,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/me
router.get("/me", auth, async (req, res) => {
  try {
    const account = await Account.findById(req.user.id).select("-password");
    const profile = await Customer.findOne({ accountId: account._id });
    res.json({
      ...account.toObject(),
      name: profile?.name,
      phone: profile?.phone,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
