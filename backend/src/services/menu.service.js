const sql = require("mssql");
const db = require("../config/db");

// Lấy tất cả danh mục món ăn
exports.getAllCategories = async () => {
  const pool = await db.poolPromise;
  const result = await pool
    .request()
    .query("SELECT category_id, name, description FROM Category");
  return result.recordset;
};

// Lấy danh sách món ăn theo category (có phân trang)
exports.getDishesByCategory = async ({ category, page, pageSize }) => {
  const pool = await db.poolPromise;
  let query =
    "SELECT dish_id, name, price, image_url, is_available, category_id FROM Dish WHERE is_available = 1";
  let params = [];
  if (category) {
    query += " AND category_id = @category";
    params.push({ name: "category", type: sql.Int, value: Number(category) });
  }
  query +=
    " ORDER BY dish_id OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY";
  params.push({ name: "offset", type: sql.Int, value: (page - 1) * pageSize });
  params.push({ name: "pageSize", type: sql.Int, value: pageSize });
  const request = pool.request();
  params.forEach((p) => request.input(p.name, p.type, p.value));
  const result = await request.query(query);
  return result.recordset;
};

// Lấy chi tiết món ăn
exports.getDishDetail = async (id) => {
  const pool = await db.poolPromise;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query(
      "SELECT dish_id, name, description, price, image_url, category_id, is_available FROM Dish WHERE dish_id = @id"
    );
  return result.recordset[0];
};
