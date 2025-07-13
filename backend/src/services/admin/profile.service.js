const { poolPromise } = require("../../config/db");

exports.getProfile = async (admin_id) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("admin_id", admin_id)
    .query(
      "SELECT admin_id, user_name, email FROM Admin WHERE admin_id = @admin_id"
    );
  if (result.recordset.length === 0) throw new Error("Admin not found");
  return result.recordset[0];
};

exports.updateProfile = async (admin_id, user_name, email) => {
  const pool = await poolPromise;
  // Kiểm tra email đã tồn tại cho admin khác chưa
  const check = await pool
    .request()
    .input("email", email)
    .input("admin_id", admin_id)
    .query(
      "SELECT admin_id FROM Admin WHERE email = @email AND admin_id <> @admin_id"
    );
  if (check.recordset.length > 0) {
    const err = new Error("Email already exists");
    err.code = "EMAIL_DUPLICATE";
    err.details = "The email is already in use by another admin.";
    throw err;
  }
  // Update
  const result = await pool
    .request()
    .input("admin_id", admin_id)
    .input("user_name", user_name)
    .input("email", email)
    .query(
      "UPDATE Admin SET user_name = @user_name, email = @email WHERE admin_id = @admin_id; SELECT admin_id, user_name, email FROM Admin WHERE admin_id = @admin_id"
    );
  return result.recordset[0];
};
