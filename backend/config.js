const SECRET = process.env.JWT_SECRET;

if (!SECRET) {
  console.error("❌ JWT_SECRET chưa được set trong .env");
  process.exit(1);
}

export default SECRET;
