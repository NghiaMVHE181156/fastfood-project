// Service xử lý logic cho Profile
const { poolPromise } = require("../config/db");
const { fixDateTimeVN } = require("../utils/time");

// Lấy thông tin profile của user
exports.getUserProfile = async (userId) => {
  const pool = await poolPromise;

  const result = await pool.request().input("user_id", userId).query(`
      SELECT user_id, email, full_name, phone, address, avatar_url
      FROM [User] 
      WHERE user_id = @user_id
    `);

  if (result.recordset.length === 0) {
    throw new Error("User not found");
  }

  const profile = result.recordset[0];

  // Format datetime fields nếu có
  if (profile.created_at) {
    profile.created_at = fixDateTimeVN(profile.created_at);
  }
  if (profile.updated_at) {
    profile.updated_at = fixDateTimeVN(profile.updated_at);
  }

  return profile;
};

// Cập nhật thông tin profile của user
exports.updateUserProfile = async (userId, updateData) => {
  const pool = await poolPromise;
  const { full_name, phone, address } = updateData;

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

  // Cập nhật profile
  const result = await pool
    .request()
    .input("user_id", userId)
    .input("full_name", full_name)
    .input("phone", phone)
    .input("address", address || null).query(`
      UPDATE [User] 
      SET full_name = @full_name, 
          phone = @phone, 
          address = @address,
          updated_at = GETDATE()
      OUTPUT INSERTED.user_id, INSERTED.full_name, INSERTED.phone, INSERTED.address
      WHERE user_id = @user_id
    `);

  if (result.recordset.length === 0) {
    throw new Error("User not found");
  }

  return result.recordset[0];
};
