const { sql, poolPromise } = require("../../config/db");
const { getCurrentVietnamTime, fixDateTimeVN } = require("../../utils/time");

// Lấy danh sách đơn hàng mới chưa có shipper nhận
exports.getAvailableOrders = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT s.order_id, o.total_amount, u.user_name, u.address, s.updated_at
    FROM Shipping s
    INNER JOIN [Order] o ON s.order_id = o.order_id
    INNER JOIN [User] u ON o.user_id = u.user_id
    WHERE s.current_status = 'pending' AND (s.shipper_id IS NULL OR s.shipper_id = 0)
    ORDER BY s.updated_at DESC
  `);
  return result.recordset.map((row) => ({
    order_id: row.order_id,
    user_name: row.user_name,
    address: row.address,
    total_amount: row.total_amount,
    updated_at: fixDateTimeVN(row.updated_at),
  }));
};

// Shipper nhận đơn
exports.assignOrderToShipper = async (orderId, shipperId) => {
  const pool = await poolPromise;
  const transaction = new sql.Transaction(pool);
  try {
    await transaction.begin();
    // Kiểm tra đơn hàng hợp lệ
    const checkResult = await transaction
      .request()
      .input("order_id", sql.Int, orderId)
      .query(
        `SELECT shipper_id, current_status FROM Shipping WHERE order_id = @order_id`
      );
    if (
      checkResult.recordset.length === 0 ||
      checkResult.recordset[0].shipper_id ||
      checkResult.recordset[0].current_status !== "pending"
    ) {
      throw { code: "ORDER_NOT_FOUND_OR_ASSIGNED" };
    }
    // Gán shipper cho đơn hàng
    await transaction
      .request()
      .input("order_id", sql.Int, orderId)
      .input("shipper_id", sql.Int, shipperId)
      .input("updated_at", sql.DateTime, getCurrentVietnamTime())
      .query(
        `UPDATE Shipping SET shipper_id = @shipper_id, updated_at = @updated_at WHERE order_id = @order_id`
      );
    // Ghi log assigned
    await transaction
      .request()
      .input("order_id", sql.Int, orderId)
      .input("status", sql.VarChar(20), "assigned")
      .input("timestamp", sql.DateTime, getCurrentVietnamTime())
      .query(
        `INSERT INTO DeliveryLog (order_id, status, timestamp) VALUES (@order_id, @status, @timestamp)`
      );
    await transaction.commit();
    return { success: true };
  } catch (err) {
    await transaction.rollback();
    return { success: false };
  }
};

// PATCH /shipper/orders/:id/onway
exports.updateOrderOnWay = async (orderId, shipperId) => {
  const pool = await poolPromise;
  const transaction = new sql.Transaction(pool);
  try {
    await transaction.begin();
    // Kiểm tra đơn hàng hợp lệ và shipper đúng
    const checkResult = await transaction
      .request()
      .input("order_id", sql.Int, orderId)
      .input("shipper_id", sql.Int, shipperId)
      .query(
        `SELECT current_status FROM Shipping WHERE order_id = @order_id AND shipper_id = @shipper_id`
      );
    if (
      checkResult.recordset.length === 0 ||
      (checkResult.recordset[0].current_status !== "pending" &&
        checkResult.recordset[0].current_status !== "returned")
    ) {
      throw { code: "ORDER_NOT_FOUND_OR_NOT_PENDING_OR_RETURNED" };
    }
    // Cập nhật trạng thái on_way
    await transaction
      .request()
      .input("order_id", sql.Int, orderId)
      .input("status", sql.VarChar(20), "on_way")
      .input("updated_at", sql.DateTime, getCurrentVietnamTime())
      .query(
        `UPDATE Shipping SET current_status = @status, updated_at = @updated_at WHERE order_id = @order_id`
      );
    // Ghi log delivering
    await transaction
      .request()
      .input("order_id", sql.Int, orderId)
      .input("status", sql.VarChar(20), "delivering")
      .input("timestamp", sql.DateTime, getCurrentVietnamTime())
      .query(
        `INSERT INTO DeliveryLog (order_id, status, timestamp) VALUES (@order_id, @status, @timestamp)`
      );
    await transaction.commit();
    return { success: true };
  } catch (err) {
    await transaction.rollback();
    return { success: false };
  }
};

// PATCH /shipper/orders/:id/delivered
exports.updateOrderDelivered = async (orderId, shipperId) => {
  const pool = await poolPromise;
  const transaction = new sql.Transaction(pool);
  try {
    await transaction.begin();
    // Kiểm tra đơn hàng hợp lệ và shipper đúng
    const checkResult = await transaction
      .request()
      .input("order_id", sql.Int, orderId)
      .input("shipper_id", sql.Int, shipperId)
      .query(
        `SELECT current_status FROM Shipping WHERE order_id = @order_id AND shipper_id = @shipper_id`
      );
    if (
      checkResult.recordset.length === 0 ||
      checkResult.recordset[0].current_status !== "on_way"
    ) {
      throw { code: "ORDER_NOT_FOUND_OR_NOT_ON_WAY" };
    }
    // Cập nhật trạng thái delivered
    await transaction
      .request()
      .input("order_id", sql.Int, orderId)
      .input("status", sql.VarChar(20), "delivered")
      .input("updated_at", sql.DateTime, getCurrentVietnamTime())
      .query(
        `UPDATE Shipping SET current_status = @status, updated_at = @updated_at WHERE order_id = @order_id`
      );
    // Ghi log success
    await transaction
      .request()
      .input("order_id", sql.Int, orderId)
      .input("status", sql.VarChar(20), "success")
      .input("timestamp", sql.DateTime, getCurrentVietnamTime())
      .query(
        `INSERT INTO DeliveryLog (order_id, status, timestamp) VALUES (@order_id, @status, @timestamp)`
      );
    // Cập nhật Order.status = 'success'
    await transaction
      .request()
      .input("order_id", sql.Int, orderId)
      .query(
        `UPDATE [Order] SET status = 'success' WHERE order_id = @order_id`
      );
    // Cập nhật Payment.status = 'completed'
    await transaction
      .request()
      .input("order_id", sql.Int, orderId)
      .input("paid_at", sql.DateTime, getCurrentVietnamTime())
      .query(
        `UPDATE Payment SET status = 'completed', paid_at = @paid_at WHERE order_id = @order_id`
      );
    await transaction.commit();
    return { success: true };
  } catch (err) {
    await transaction.rollback();
    return { success: false };
  }
};

// PATCH /shipper/orders/:id/failed1
exports.updateOrderFailed1 = async (orderId, shipperId, note) => {
  const pool = await poolPromise;
  const transaction = new sql.Transaction(pool);
  try {
    await transaction.begin();
    // Kiểm tra đơn hàng hợp lệ và shipper đúng
    const checkResult = await transaction
      .request()
      .input("order_id", sql.Int, orderId)
      .input("shipper_id", sql.Int, shipperId)
      .query(
        `SELECT current_status FROM Shipping WHERE order_id = @order_id AND shipper_id = @shipper_id`
      );
    if (
      checkResult.recordset.length === 0 ||
      checkResult.recordset[0].current_status !== "on_way"
    ) {
      throw { code: "ORDER_NOT_FOUND_OR_NOT_ON_WAY" };
    }
    // Cập nhật trạng thái failed
    await transaction
      .request()
      .input("order_id", sql.Int, orderId)
      .input("status", sql.VarChar(20), "failed")
      .input("updated_at", sql.DateTime, getCurrentVietnamTime())
      .query(
        `UPDATE Shipping SET current_status = @status, updated_at = @updated_at WHERE order_id = @order_id`
      );
    // Ghi log failed_1 với note
    await transaction
      .request()
      .input("order_id", sql.Int, orderId)
      .input("status", sql.VarChar(20), "failed_1")
      .input("timestamp", sql.DateTime, getCurrentVietnamTime())
      .input("note", sql.NVarChar, note || null)
      .query(
        `INSERT INTO DeliveryLog (order_id, status, timestamp, note) VALUES (@order_id, @status, @timestamp, @note)`
      );
    await transaction.commit();
    return { success: true };
  } catch (err) {
    await transaction.rollback();
    return { success: false };
  }
};

// PATCH /shipper/orders/:id/redelivery
exports.updateOrderRedelivery = async (orderId, shipperId, note) => {
  const pool = await poolPromise;
  const transaction = new sql.Transaction(pool);
  try {
    await transaction.begin();
    // Kiểm tra đơn hàng hợp lệ và shipper đúng
    const checkResult = await transaction
      .request()
      .input("order_id", sql.Int, orderId)
      .input("shipper_id", sql.Int, shipperId)
      .query(
        `SELECT current_status FROM Shipping WHERE order_id = @order_id AND shipper_id = @shipper_id`
      );
    if (
      checkResult.recordset.length === 0 ||
      checkResult.recordset[0].current_status !== "failed"
    ) {
      throw { code: "ORDER_NOT_FOUND_OR_NOT_FAILED" };
    }
    // Cập nhật trạng thái returned
    await transaction
      .request()
      .input("order_id", sql.Int, orderId)
      .input("status", sql.VarChar(20), "returned")
      .input("updated_at", sql.DateTime, getCurrentVietnamTime())
      .query(
        `UPDATE Shipping SET current_status = @status, updated_at = @updated_at WHERE order_id = @order_id`
      );
    // Ghi log redelivery với note
    await transaction
      .request()
      .input("order_id", sql.Int, orderId)
      .input("status", sql.VarChar(20), "redelivery")
      .input("timestamp", sql.DateTime, getCurrentVietnamTime())
      .input("note", sql.NVarChar, note || null)
      .query(
        `INSERT INTO DeliveryLog (order_id, status, timestamp, note) VALUES (@order_id, @status, @timestamp, @note)`
      );
    await transaction.commit();
    return { success: true };
  } catch (err) {
    await transaction.rollback();
    return { success: false };
  }
};

// PATCH /shipper/orders/:id/redelivered
exports.updateOrderRedelivered = async (orderId, shipperId) => {
  const pool = await poolPromise;
  const transaction = new sql.Transaction(pool);
  try {
    await transaction.begin();
    // Kiểm tra đơn hàng hợp lệ và shipper đúng
    const checkResult = await transaction
      .request()
      .input("order_id", sql.Int, orderId)
      .input("shipper_id", sql.Int, shipperId)
      .query(
        `SELECT current_status FROM Shipping WHERE order_id = @order_id AND shipper_id = @shipper_id`
      );
    if (
      checkResult.recordset.length === 0 ||
      checkResult.recordset[0].current_status !== "returned"
    ) {
      throw { code: "ORDER_NOT_FOUND_OR_NOT_RETURNED" };
    }
    // Cập nhật trạng thái delivered
    await transaction
      .request()
      .input("order_id", sql.Int, orderId)
      .input("status", sql.VarChar(20), "delivered")
      .input("updated_at", sql.DateTime, getCurrentVietnamTime())
      .query(
        `UPDATE Shipping SET current_status = @status, updated_at = @updated_at WHERE order_id = @order_id`
      );
    // Ghi log success
    await transaction
      .request()
      .input("order_id", sql.Int, orderId)
      .input("status", sql.VarChar(20), "success")
      .input("timestamp", sql.DateTime, getCurrentVietnamTime())
      .query(
        `INSERT INTO DeliveryLog (order_id, status, timestamp) VALUES (@order_id, @status, @timestamp)`
      );
    // Cập nhật Order.status = 'success'
    await transaction
      .request()
      .input("order_id", sql.Int, orderId)
      .query(
        `UPDATE [Order] SET status = 'success' WHERE order_id = @order_id`
      );
    // Cập nhật Payment.status = 'completed'
    await transaction
      .request()
      .input("order_id", sql.Int, orderId)
      .input("paid_at", sql.DateTime, getCurrentVietnamTime())
      .query(
        `UPDATE Payment SET status = 'completed', paid_at = @paid_at WHERE order_id = @order_id`
      );
    await transaction.commit();
    return { success: true };
  } catch (err) {
    await transaction.rollback();
    return { success: false };
  }
};

// PATCH /shipper/orders/:id/failed2
exports.updateOrderFailed2 = async (orderId, shipperId, note) => {
  const pool = await poolPromise;
  const transaction = new sql.Transaction(pool);
  try {
    await transaction.begin();
    // Kiểm tra đơn hàng hợp lệ và shipper đúng
    const checkResult = await transaction
      .request()
      .input("order_id", sql.Int, orderId)
      .input("shipper_id", sql.Int, shipperId)
      .query(
        `SELECT current_status FROM Shipping WHERE order_id = @order_id AND shipper_id = @shipper_id`
      );
    if (
      checkResult.recordset.length === 0 ||
      (checkResult.recordset[0].current_status !== "returned" &&
        checkResult.recordset[0].current_status !== "on_way")
    ) {
      throw { code: "ORDER_NOT_FOUND_OR_NOT_RETURNED_OR_ON_WAY" };
    }
    // Cập nhật trạng thái failed
    await transaction
      .request()
      .input("order_id", sql.Int, orderId)
      .input("status", sql.VarChar(20), "bomb")
      .input("updated_at", sql.DateTime, getCurrentVietnamTime())
      .query(
        `UPDATE Shipping SET current_status = @status, updated_at = @updated_at WHERE order_id = @order_id`
      );
    // Ghi log failed_2 với note
    await transaction
      .request()
      .input("order_id", sql.Int, orderId)
      .input("status", sql.VarChar(20), "failed_2")
      .input("timestamp", sql.DateTime, getCurrentVietnamTime())
      .input("note", sql.NVarChar, note || null)
      .query(
        `INSERT INTO DeliveryLog (order_id, status, timestamp, note) VALUES (@order_id, @status, @timestamp, @note)`
      );
    // Cập nhật Order.status = 'bomb'
    await transaction
      .request()
      .input("order_id", sql.Int, orderId)
      .query(`UPDATE [Order] SET status = 'bomb' WHERE order_id = @order_id`);
    await transaction.commit();
    return { success: true };
  } catch (err) {
    await transaction.rollback();
    return { success: false };
  }
};
