const { sql, poolPromise } = require("../../config/db");
const { getCurrentVietnamTime } = require("../../utils/time");

// Lấy toàn bộ đơn hàng, có filter bomb
exports.getAllOrders = async ({ bomb }) => {
  const pool = await poolPromise;
  let query = `SELECT o.*, u.user_name, u.is_flagged, u.boom_count FROM [Order] o JOIN [User] u ON o.user_id = u.user_id`;
  if (bomb === "true") {
    query += ` WHERE o.status = 'bomb'`;
  }
  query += ` ORDER BY o.created_at DESC`;
  const result = await pool.request().query(query);
  return result.recordset;
};

// Xác nhận khách hàng bom đơn
exports.confirmBombOrder = async (orderId) => {
  const pool = await poolPromise;
  // Lấy user_id từ order
  const orderRes = await pool
    .request()
    .input("order_id", sql.Int, orderId)
    .query(`SELECT user_id FROM [Order] WHERE order_id = @order_id`);
  if (orderRes.recordset.length === 0)
    return { success: false, message: "Không tìm thấy đơn hàng" };
  const userId = orderRes.recordset[0].user_id;
  // Tăng boom_count, set is_flagged nếu cần
  const userRes = await pool
    .request()
    .input("user_id", sql.Int, userId)
    .query(`SELECT boom_count FROM [User] WHERE user_id = @user_id`);
  let boomCount = (userRes.recordset[0]?.boom_count || 0) + 1;
  let isFlagged = boomCount >= 2 ? 1 : 0;
  await pool
    .request()
    .input("user_id", sql.Int, userId)
    .input("boom_count", sql.Int, boomCount)
    .input("is_flagged", sql.Bit, isFlagged)
    .query(
      `UPDATE [User] SET boom_count = @boom_count, is_flagged = @is_flagged WHERE user_id = @user_id`
    );
  return { success: true };
};

// Gỡ cờ is_flagged cho user
exports.unflagUser = async (userId) => {
  const pool = await poolPromise;
  await pool
    .request()
    .input("user_id", sql.Int, userId)
    .query(`UPDATE [User] SET is_flagged = 0 WHERE user_id = @user_id`);
  return { success: true };
};
