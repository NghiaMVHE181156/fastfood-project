const DatabaseService = require("../services/databaseService");
const ApiResponse = require("../utils/response");
const { toVietnamTimeString } = require("../utils/time");

class DatabaseController {
  // Kiểm tra trạng thái database
  static async getDatabaseStatus(req, res) {
    try {
      const isConnected = await DatabaseService.testConnection();
      const dbInfo = await DatabaseService.getDatabaseInfo();

      // Format thời gian về múi giờ Việt Nam
      if (dbInfo.current_datetime) {
        dbInfo.current_datetime = toVietnamTimeString(dbInfo.current_datetime);
      }

      ApiResponse.success(
        res,
        {
          connected: isConnected,
          info: dbInfo,
        },
        "Database status retrieved successfully"
      );
    } catch (error) {
      ApiResponse.error(res, "Failed to get database status", 500, error);
    }
  }

  // Thực thi query tùy chỉnh (chỉ cho admin)
  static async executeCustomQuery(req, res) {
    try {
      const { query, params } = req.body;

      if (!query) {
        return ApiResponse.badRequest(res, "Query is required");
      }

      const result = await DatabaseService.executeQuery(query, params || []);

      ApiResponse.success(
        res,
        {
          result,
          rowCount: result.length,
        },
        "Query executed successfully"
      );
    } catch (error) {
      ApiResponse.error(res, "Failed to execute query", 500, error);
    }
  }

  // Lấy danh sách bảng trong database
  static async getTables(req, res) {
    try {
      const query = `
        SELECT 
          TABLE_NAME as table_name,
          TABLE_SCHEMA as schema_name
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_TYPE = 'BASE TABLE'
        ORDER BY TABLE_SCHEMA, TABLE_NAME
      `;

      const tables = await DatabaseService.executeQuery(query);

      ApiResponse.success(
        res,
        {
          tables,
          count: tables.length,
        },
        "Tables retrieved successfully"
      );
    } catch (error) {
      ApiResponse.error(res, "Failed to get tables", 500, error);
    }
  }

  // Lấy thông tin cột của bảng
  static async getTableColumns(req, res) {
    try {
      const { tableName } = req.params;

      if (!tableName) {
        return ApiResponse.badRequest(res, "Table name is required");
      }

      const query = `
        SELECT 
          COLUMN_NAME as column_name,
          DATA_TYPE as data_type,
          IS_NULLABLE as is_nullable,
          COLUMN_DEFAULT as default_value
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = @param1
        ORDER BY ORDINAL_POSITION
      `;

      const columns = await DatabaseService.executeQuery(query, [tableName]);

      ApiResponse.success(
        res,
        {
          tableName,
          columns,
          count: columns.length,
        },
        "Table columns retrieved successfully"
      );
    } catch (error) {
      ApiResponse.error(res, "Failed to get table columns", 500, error);
    }
  }
}

module.exports = DatabaseController;
