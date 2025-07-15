const { sql, poolPromise } = require("../config/db");

exports.isUserFlagged = async (userId) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("user_id", sql.Int, userId)
    .query("SELECT is_flagged FROM [User] WHERE user_id = @user_id");
  if (result.recordset.length === 0) return false;
  return !!result.recordset[0].is_flagged;
};
