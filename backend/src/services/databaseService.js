const { poolPromise, sql } = require("../config/db");

class DatabaseService {
  // Thực thi query đơn giản
  static async executeQuery(query, params = []) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      // Thêm parameters nếu có
      params.forEach((param, index) => {
        request.input(`param${index + 1}`, param);
      });

      const result = await request.query(query);
      return result.recordset;
    } catch (error) {
      console.error("Database query error:", error);
      throw error;
    }
  }

  // Thực thi stored procedure
  static async executeStoredProcedure(procedureName, params = {}) {
    try {
      const pool = await poolPromise;
      const request = pool.request();

      // Thêm parameters
      Object.keys(params).forEach((key) => {
        request.input(key, params[key]);
      });

      const result = await request.execute(procedureName);
      return result.recordset;
    } catch (error) {
      console.error("Stored procedure error:", error);
      throw error;
    }
  }

  // Kiểm tra kết nối database
  static async testConnection() {
    try {
      const pool = await poolPromise;
      const result = await pool.request().query("SELECT 1 as test");
      return result.recordset[0].test === 1;
    } catch (error) {
      console.error("Connection test failed:", error);
      return false;
    }
  }

  // Lấy thông tin database
  static async getDatabaseInfo() {
    try {
      const pool = await poolPromise;
      const result = await pool.request().query(`
        SELECT 
          DB_NAME() as database_name,
          @@VERSION as sql_version,
          GETDATE() as current_datetime
      `);
      return result.recordset[0];
    } catch (error) {
      console.error("Database info error:", error);
      throw error;
    }
  }
}

module.exports = DatabaseService;
