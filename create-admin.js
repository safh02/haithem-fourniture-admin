// Run this ONCE to create your first admin account
// Usage: node create-admin.js
// Requirements: npm install node-fetch bcryptjs pg dotenv

require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function createAdmin() {
  const email = 'haithem@haithemfourniture.dz';
  const password = 'Admin2024!';
  const name = 'Haithem';

  try {
    const hashed = await bcrypt.hash(password, 12);
    const result = await pool.query(
      'INSERT INTO admin_users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email, hashed, name]
    );
    console.log('✅ Admin created:', result.rows[0]);
    console.log(`\nLogin with:\n  Email: ${email}\n  Password: ${password}\n`);
  } catch (err) {
    if (err.code === '23505') console.log('⚠️ Admin already exists');
    else console.error('❌ Error:', err.message);
  } finally {
    await pool.end();
  }
}

createAdmin();
