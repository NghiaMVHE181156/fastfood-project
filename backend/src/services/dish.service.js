const { poolPromise } = require("../config/db");
const sql = require("mssql");

// Lấy danh sách món ăn (có phân trang, tìm kiếm, lọc, sắp xếp)
async function getAllDishes({
  page = 1,
  limit = 10,
  search = "",
  category,
  sort,
}) {
  let pool = await poolPromise;
  let offset = (page - 1) * limit;
  let where = "WHERE is_available = 1";
  let params = [];

  if (search) {
    where += " AND name LIKE @search";
    params.push({ name: "search", type: "NVarChar", value: `%${search}%` });
  }
  if (category) {
    where += " AND category_id = @category_id";
    params.push({ name: "category_id", type: "Int", value: category });
  }

  let orderBy = "dish_id DESC";
  if (sort) {
    switch (sort) {
      case "price_asc":
        orderBy = "price ASC";
        break;
      case "price_desc":
        orderBy = "price DESC";
        break;
      case "name_asc":
        orderBy = "name ASC";
        break;
      case "name_desc":
        orderBy = "name DESC";
        break;
      case "category_asc":
        orderBy = "category_id ASC";
        break;
      case "category_desc":
        orderBy = "category_id DESC";
        break;
    }
  }

  let query = `SELECT * FROM Dish ${where} ORDER BY ${orderBy} OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`;
  params.push({ name: "offset", type: "Int", value: offset });
  params.push({ name: "limit", type: "Int", value: limit });

  let request = pool.request();
  params.forEach((p) => {
    if (!p || !p.type || !sql[p.type]) {
      throw new Error(`Invalid param: ${JSON.stringify(p)}`);
    }
    request.input(p.name, sql[p.type], p.value);
  });
  let result = await request.query(query);
  return result.recordset;
}

// Kiểm tra name đã tồn tại (tùy chọn loại trừ id khi update)
async function isNameExists(name, excludeId) {
  let pool = await poolPromise;
  let query = "SELECT dish_id FROM Dish WHERE name = @name";
  let request = pool.request().input("name", sql.NVarChar, name);
  if (excludeId) {
    query += " AND dish_id != @excludeId";
    request.input("excludeId", sql.Int, excludeId);
  }
  let result = await request.query(query);
  return result.recordset.length > 0;
}

// Kiểm tra category_id tồn tại
async function isCategoryExists(category_id) {
  let pool = await poolPromise;
  let query =
    "SELECT category_id FROM Category WHERE category_id = @category_id";
  let result = await pool
    .request()
    .input("category_id", sql.Int, category_id)
    .query(query);
  return result.recordset.length > 0;
}

// Tạo món ăn mới
async function createDish(data) {
  let pool = await poolPromise;
  let query = `INSERT INTO Dish (name, description, price, image_url, category_id, is_available)
    OUTPUT INSERTED.*
    VALUES (@name, @description, @price, @image_url, @category_id, @is_available)`;
  let request = pool
    .request()
    .input("name", sql.NVarChar, data.name)
    .input("description", sql.NVarChar, data.description || null)
    .input("price", sql.Int, data.price)
    .input("image_url", sql.NVarChar, data.image_url || null)
    .input("category_id", sql.Int, data.category_id)
    .input(
      "is_available",
      sql.Bit,
      data.is_available !== undefined ? data.is_available : true
    );
  let result = await request.query(query);
  return result.recordset[0];
}

// Cập nhật món ăn
async function updateDish(id, data) {
  let pool = await poolPromise;
  let fields = [];
  let request = pool.request().input("id", sql.Int, id);
  if (data.name !== undefined) {
    fields.push("name = @name");
    request.input("name", sql.NVarChar, data.name);
  }
  if (data.description !== undefined) {
    fields.push("description = @description");
    request.input("description", sql.NVarChar, data.description);
  }
  if (data.price !== undefined) {
    fields.push("price = @price");
    request.input("price", sql.Int, data.price);
  }
  if (data.image_url !== undefined) {
    fields.push("image_url = @image_url");
    request.input("image_url", sql.NVarChar, data.image_url);
  }
  if (data.category_id !== undefined) {
    fields.push("category_id = @category_id");
    request.input("category_id", sql.Int, data.category_id);
  }
  if (data.is_available !== undefined) {
    fields.push("is_available = @is_available");
    request.input("is_available", sql.Bit, data.is_available);
  }
  if (!fields.length) throw new Error("NO_UPDATE_FIELD");
  let query = `UPDATE Dish SET ${fields.join(", ")}
    OUTPUT INSERTED.* WHERE dish_id = @id`;
  let result = await request.query(query);
  return result.recordset[0];
}

// Soft delete: chỉ cập nhật is_available = 0
async function deleteDish(id) {
  let pool = await poolPromise;
  // Kiểm tra tồn tại
  let oldDish = await pool
    .request()
    .input("id", sql.Int, id)
    .query("SELECT * FROM Dish WHERE dish_id = @id");
  if (!oldDish.recordset[0]) {
    const err = new Error("DISH_NOT_FOUND");
    err.code = "DISH_NOT_FOUND";
    throw err;
  }
  // Update is_available = 0
  let result = await pool
    .request()
    .input("id", sql.Int, id)
    .query("UPDATE Dish SET is_available = 0 WHERE dish_id = @id");
  return result.rowsAffected[0] > 0;
}

// Lấy 1 món ăn theo id
async function getDishById(id) {
  let pool = await poolPromise;
  let query = "SELECT * FROM Dish WHERE dish_id = @id";
  let result = await pool.request().input("id", sql.Int, id).query(query);
  return result.recordset[0];
}

// Khôi phục món ăn (is_available = 1)
async function restoreDish(id) {
  let pool = await poolPromise;
  // Kiểm tra tồn tại
  let oldDish = await pool
    .request()
    .input("id", sql.Int, id)
    .query("SELECT * FROM Dish WHERE dish_id = @id");
  if (!oldDish.recordset[0]) {
    const err = new Error("DISH_NOT_FOUND");
    err.code = "DISH_NOT_FOUND";
    throw err;
  }
  // Update is_available = 1
  let result = await pool
    .request()
    .input("id", sql.Int, id)
    .query("UPDATE Dish SET is_available = 1 WHERE dish_id = @id");
  return result.rowsAffected[0] > 0;
}

module.exports = {
  getAllDishes,
  isNameExists,
  isCategoryExists,
  createDish,
  updateDish,
  deleteDish,
  getDishById,
  restoreDish,
};
