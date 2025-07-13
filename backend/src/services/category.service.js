const { poolPromise } = require("../config/db");

// Helper: build sort SQL
function buildSort(sort) {
  if (!sort) return "ORDER BY category_id DESC";
  if (sort === "id_asc") return "ORDER BY category_id ASC";
  if (sort === "id_desc") return "ORDER BY category_id DESC";
  if (sort === "name_asc") return "ORDER BY name ASC";
  if (sort === "name_desc") return "ORDER BY name DESC";
  return "ORDER BY category_id DESC";
}

exports.getAllCategories = async ({ page, limit, search, sort }) => {
  let pool = await poolPromise;
  let query = "SELECT category_id, name, description FROM Category";
  let where = [];
  let params = {};
  if (search) {
    where.push("name LIKE @search");
    params["search"] = `%${search}%`;
  }
  if (where.length > 0) {
    query += " WHERE " + where.join(" AND ");
  }
  query += " " + buildSort(sort);
  // Pagination
  if (limit) {
    query += " OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY";
    params["offset"] = ((parseInt(page) || 1) - 1) * parseInt(limit);
    params["limit"] = parseInt(limit);
  }
  let request = pool.request();
  Object.keys(params).forEach((k) => request.input(k, params[k]));
  const result = await request.query(query);
  return result.recordset;
};

exports.createCategory = async ({ name, description }) => {
  let pool = await poolPromise;
  // Check duplicate name
  let check = await pool
    .request()
    .input("name", name)
    .query("SELECT category_id FROM Category WHERE name = @name");
  if (check.recordset.length > 0) {
    const err = new Error("Category name already exists");
    err.code = "DUPLICATE_NAME";
    throw err;
  }
  // Insert
  let insert = await pool
    .request()
    .input("name", name)
    .input("description", description || null)
    .query(
      "INSERT INTO Category (name, description) OUTPUT INSERTED.category_id, INSERTED.name, INSERTED.description VALUES (@name, @description)"
    );
  return insert.recordset[0];
};

exports.updateCategory = async (id, { name, description }) => {
  let pool = await poolPromise;
  // Check tồn tại
  let exist = await pool
    .request()
    .input("id", id)
    .query("SELECT * FROM Category WHERE category_id = @id");
  if (exist.recordset.length === 0) {
    const err = new Error("Category not found");
    err.code = "NOT_FOUND";
    throw err;
  }
  // Check duplicate name (trừ chính nó)
  let check = await pool
    .request()
    .input("name", name)
    .input("id", id)
    .query(
      "SELECT category_id FROM Category WHERE name = @name AND category_id != @id"
    );
  if (check.recordset.length > 0) {
    const err = new Error("Category name already exists");
    err.code = "DUPLICATE_NAME";
    throw err;
  }
  // Update
  await pool
    .request()
    .input("id", id)
    .input("name", name)
    .input("description", description || null)
    .query(
      "UPDATE Category SET name = @name, description = @description WHERE category_id = @id"
    );
  // Lấy lại category vừa cập nhật
  let result = await pool
    .request()
    .input("id", id)
    .query(
      "SELECT category_id, name, description FROM Category WHERE category_id = @id"
    );
  if (!result.recordset[0]) {
    const err = new Error("Update failed or category not found");
    err.code = "NOT_FOUND";
    throw err;
  }
  return result.recordset[0];
};

exports.deleteCategory = async (id) => {
  let pool = await poolPromise;
  // Check tồn tại
  let exist = await pool
    .request()
    .input("id", id)
    .query("SELECT * FROM Category WHERE category_id = @id");
  if (exist.recordset.length === 0) {
    const err = new Error("Category not found");
    err.code = "NOT_FOUND";
    throw err;
  }
  // Check ràng buộc với Dish
  let dish = await pool
    .request()
    .input("id", id)
    .query("SELECT * FROM Dish WHERE category_id = @id");
  if (dish.recordset.length > 0) {
    const err = new Error("Dish table references this category");
    err.code = "CATEGORY_IN_USE";
    throw err;
  }
  // Delete
  await pool
    .request()
    .input("id", id)
    .query("DELETE FROM Category WHERE category_id = @id");
  return true;
};

// Kiểm tra category_id tồn tại
async function isCategoryExists(category_id) {
  let pool = await poolPromise;
  let result = await pool
    .request()
    .input("category_id", require("mssql").Int, category_id)
    .query("SELECT category_id FROM Category WHERE category_id = @category_id");
  return result.recordset.length > 0;
}

module.exports.isCategoryExists = isCategoryExists;
