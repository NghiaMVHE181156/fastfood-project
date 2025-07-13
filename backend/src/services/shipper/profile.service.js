const { poolPromise } = require("../../config/db");

exports.getProfile = async (shipper_id) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("shipper_id", shipper_id)
    .query(
      "SELECT shipper_id, user_name, email, phone, full_name, created_at FROM Shipper WHERE shipper_id = @shipper_id"
    );
  if (result.recordset.length === 0) throw new Error("Shipper not found");
  return result.recordset[0];
};

exports.updateProfile = async (shipper_id, full_name, phone) => {
  const pool = await poolPromise;
  // Kiểm tra phone đã tồn tại cho shipper khác chưa
  const check = await pool
    .request()
    .input("phone", phone)
    .input("shipper_id", shipper_id)
    .query(
      "SELECT shipper_id FROM Shipper WHERE phone = @phone AND shipper_id <> @shipper_id"
    );
  if (check.recordset.length > 0) {
    const err = new Error("Phone number already exists");
    err.code = "PHONE_DUPLICATE";
    err.details = "The phone number is already in use by another shipper.";
    throw err;
  }
  // Update
  const result = await pool
    .request()
    .input("shipper_id", shipper_id)
    .input("full_name", full_name)
    .input("phone", phone)
    .query(
      "UPDATE Shipper SET full_name = @full_name, phone = @phone WHERE shipper_id = @shipper_id; SELECT shipper_id, full_name, phone FROM Shipper WHERE shipper_id = @shipper_id"
    );
  return result.recordset[0];
};
