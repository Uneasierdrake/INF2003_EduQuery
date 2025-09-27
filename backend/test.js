const pool = require('./pg-connection');

async function test() {
  try {
    const res = await pool.query("SELECT NOW();");
    console.log("✅ Connected! Current time:", res.rows[0]);
  } catch (err) {
    console.error("❌ Connection error:", err.message);
  }
}

test();
