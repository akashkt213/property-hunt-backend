import app from "./app.js";
import { pool } from "./config/db.js";

console.log("dbpassword",process.env.DB_PASSWORD)

const PORT = process.env.PORT || 5000;
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("TYPE:", typeof process.env.DB_PASSWORD);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

(async () => {
  try {
    const res = await pool.query("SELECT 1");
    console.log("DB connected ✅", res.rows);
  } catch (err) {
    console.error("DB connection failed ❌", err);
  }
})();