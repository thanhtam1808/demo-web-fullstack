import jwt from "jsonwebtoken";
import SECRET from "../config.js";

export const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer "))
    return res.status(401).json({ message: "Không có token xác thực" });
  try {
    req.user = jwt.verify(header.split(" ")[1], SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin")
    return res.status(403).json({ message: "Yêu cầu quyền Admin" });
  next();
};
