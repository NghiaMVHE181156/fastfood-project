const bcrypt = require("bcrypt");
const { sql, poolPromise } = require("../config/db");
const { getCurrentVietnamTime, fixDateTimeVN } = require("../utils/time");

// Lấy tất cả shipper
async function getAllShippers() {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .query(
      `SELECT shipper_id, user_name, full_name, email, phone, created_at FROM Shipper`
    );
  return result.recordset;
}

// Kiểm tra email hoặc phone đã tồn tại chưa (trừ 1 id nếu update)
async function isEmailOrPhoneDuplicate({ email, phone, excludeId }) {
  const pool = await poolPromise;
  let query = `SELECT shipper_id, email, phone FROM Shipper WHERE (email = @email OR phone = @phone)`;
  if (excludeId) {
    query += " AND shipper_id != @excludeId";
  }
  const req = pool.request();
  req.input("email", email);
  req.input("phone", phone);
  if (excludeId) req.input("excludeId", excludeId);
  const result = await req.query(query);
  return result.recordset.length > 0 ? result.recordset[0] : null;
}

// Tạo mới shipper
async function createShipper({ user_name, full_name, email, phone, password }) {
  const pool = await poolPromise;
  const password_hash = await bcrypt.hash(password, 10);
  const result = await pool
    .request()
    .input("user_name", user_name)
    .input("full_name", full_name)
    .input("email", email)
    .input("phone", phone)
    .input("password_hash", password_hash)
    .query(`INSERT INTO Shipper (user_name, full_name, email, phone, password_hash)
            OUTPUT INSERTED.shipper_id, INSERTED.user_name, INSERTED.full_name, INSERTED.email, INSERTED.phone, INSERTED.created_at
            VALUES (@user_name, @full_name, @email, @phone, @password_hash)`);
  return result.recordset[0];
}

// Update profile shipper (không update user_name, password)
async function updateShipper({ shipper_id, full_name, email, phone }) {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("shipper_id", shipper_id)
    .input("full_name", full_name)
    .input("email", email)
    .input("phone", phone).query(`UPDATE Shipper SET
              full_name = @full_name,
              email = @email,
              phone = @phone
            WHERE shipper_id = @shipper_id;
            SELECT shipper_id, user_name, full_name, email, phone, created_at FROM Shipper WHERE shipper_id = @shipper_id;`);
  if (result.recordsets && result.recordsets[1] && result.recordsets[1][0]) {
    return result.recordsets[1][0];
  }
  return null;
}

// Kiểm tra shipper có liên kết với Shipping hoặc DeliveryLog không
async function isShipperReferenced(shipper_id) {
  const pool = await poolPromise;
  // Kiểm tra bảng Shipping
  const shipping = await pool
    .request()
    .input("shipper_id", shipper_id)
    .query(
      "SELECT TOP 1 shipping_id FROM Shipping WHERE shipper_id = @shipper_id"
    );
  if (shipping.recordset.length > 0) return true;
  // Có thể kiểm tra thêm bảng khác nếu cần
  return false;
}

// Xóa shipper (cứng)
async function deleteShipper(shipper_id) {
  const pool = await poolPromise;
  await pool
    .request()
    .input("shipper_id", shipper_id)
    .query("DELETE FROM Shipper WHERE shipper_id = @shipper_id");
}

// Lấy shipper theo id
async function getShipperById(shipper_id) {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("shipper_id", shipper_id)
    .query(
      "SELECT shipper_id, user_name, full_name, email, phone, created_at FROM Shipper WHERE shipper_id = @shipper_id"
    );
  return result.recordset[0];
}

// Giữ lại các hàm CRUD shipper cho admin:
module.exports = {
  getAllShippers,
  createShipper,
  updateShipper,
  deleteShipper,
  isEmailOrPhoneDuplicate,
  isShipperReferenced,
  getShipperById,
};
