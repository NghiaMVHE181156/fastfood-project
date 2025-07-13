// Service xử lý logic cho Profile
const { poolPromise } = require("../config/db");
const { fixDateTimeVN } = require("../utils/time");

// Lấy thông tin profile của user
exports.getUserProfile = async (userId) => {
  const pool = await poolPromise;
  const result = await pool.request().input("user_id", userId).query(`
      SELECT user_id, user_name, email, full_name, phone, address, avatar_url, gender, birthdate, status, is_flagged, boom_count, note, created_at
      FROM [User] 
      WHERE user_id = @user_id
    `);
  if (result.recordset.length === 0) {
    throw new Error("User not found");
  }
  const profile = result.recordset[0];
  return profile;
};

// Cập nhật thông tin profile của user
exports.updateUserProfile = async (userId, updateData) => {
  const pool = await poolPromise;
  const { full_name, phone, address, avatar_url, gender, birthdate, email } =
    updateData;
  // Kiểm tra phone có bị trùng với user khác không
  const checkPhone = await pool
    .request()
    .input("phone", phone)
    .input("user_id", userId).query(`
      SELECT user_id FROM [User] 
      WHERE phone = @phone AND user_id != @user_id
    `);
  if (checkPhone.recordset.length > 0) {
    throw new Error("Phone number already exists");
  }
  // Kiểm tra email có bị trùng với user khác không (nếu có email)
  if (email) {
    const checkEmail = await pool
      .request()
      .input("email", email)
      .input("user_id", userId).query(`
        SELECT user_id FROM [User] 
        WHERE email = @email AND user_id != @user_id
      `);
    if (checkEmail.recordset.length > 0) {
      throw new Error("Email already exists");
    }
  }
  // Cập nhật profile
  const result = await pool
    .request()
    .input("user_id", userId)
    .input("full_name", full_name)
    .input("phone", phone)
    .input("address", address || null)
    .input("avatar_url", avatar_url || null)
    .input("gender", gender || null)
    .input("birthdate", birthdate || null)
    .input("email", email || null).query(`
      UPDATE [User] 
      SET full_name = @full_name, 
          phone = @phone, 
          address = @address,
          avatar_url = @avatar_url,
          gender = @gender,
          birthdate = @birthdate,
          email = @email
      OUTPUT INSERTED.user_id, INSERTED.user_name, INSERTED.email, INSERTED.full_name, INSERTED.phone, INSERTED.address, INSERTED.avatar_url, INSERTED.gender, INSERTED.birthdate, INSERTED.status, INSERTED.is_flagged, INSERTED.boom_count, INSERTED.note, INSERTED.created_at
      WHERE user_id = @user_id
    `);
  if (result.recordset.length === 0) {
    throw new Error("User not found");
  }
  return result.recordset[0];
};
