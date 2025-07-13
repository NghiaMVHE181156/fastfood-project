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
