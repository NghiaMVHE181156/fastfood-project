// Service for handling Auth business logic
const { poolPromise } = require("../config/db");
const bcrypt = require("bcryptjs");

// Register user
exports.register = async (userData) => {
  const pool = await poolPromise;
  const { user_name, email, full_name, phone, password } = userData;
  // Check for duplicate email/phone/user_name
  const check = await pool
    .request()
    .input("email", email)
    .input("phone", phone)
    .input("user_name", user_name)
    .query(
      "SELECT * FROM [User] WHERE email = @email OR phone = @phone OR user_name = @user_name"
    );
  if (check.recordset.length > 0) {
    const exist = check.recordset[0];
    if (exist.email === email) throw new Error("Email already exists");
    if (exist.phone === phone) throw new Error("Phone number already exists");
    if (exist.user_name === user_name)
      throw new Error("Username already exists");
  }
  // Hash password
  const password_hash = await bcrypt.hash(password, 10);
  // Insert user
  const result = await pool
    .request()
    .input("user_name", user_name)
    .input("email", email)
    .input("full_name", full_name)
    .input("phone", phone)
    .input("password_hash", password_hash)
    .query(`INSERT INTO [User] (user_name, email, full_name, phone, password_hash, status, boom_count, is_flagged, created_at)
      OUTPUT INSERTED.user_id, INSERTED.user_name, INSERTED.email
      VALUES (@user_name, @email, @full_name, @phone, @password_hash, 'active', 0, 0, GETDATE())`);
  return result.recordset[0];
};

// Login (automatically determine role)
exports.login = async ({ user_name, password }) => {
  const pool = await poolPromise;
  let table = "User",
    idField = "user_id",
    role = "user";
  if (user_name.startsWith("admin_")) {
    table = "Admin";
    idField = "admin_id";
    role = "admin";
  } else if (user_name.startsWith("shipper_")) {
    table = "Shipper";
    idField = "shipper_id";
    role = "shipper";
  }
  // Find user
  const result = await pool
    .request()
    .input("user_name", user_name)
    .query(`SELECT * FROM [${table}] WHERE user_name = @user_name`);
  if (result.recordset.length === 0) throw new Error("Account does not exist");
  const user = result.recordset[0];
  // Compare password
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new Error("Incorrect password");
  return {
    id: user[idField],
    role,
    user_name: user.user_name,
    email: user.email,
  };
};

// Get profile
exports.getProfile = async (userId, role) => {
  const pool = await poolPromise;
  let table, idField, selectFields;

  if (role === "admin") {
    table = "Admin";
    idField = "admin_id";
    selectFields = `${idField}, user_name, email`; // only actual fields
  } else if (role === "shipper") {
    table = "Shipper";
    idField = "shipper_id";
    selectFields = `${idField}, user_name, full_name, phone, email, created_at`; // actual fields
  } else {
    table = "User";
    idField = "user_id";
    selectFields = `${idField}, user_name, email, full_name, phone, address, avatar_url, gender, birthdate, status, is_flagged, boom_count, note, created_at`;
  }

  const result = await pool
    .request()
    .input("id", userId)
    .query(`SELECT ${selectFields} FROM [${table}] WHERE ${idField} = @id`);

  if (result.recordset.length === 0) throw new Error("User not found");
  return result.recordset[0];
};
