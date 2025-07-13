const { sql, poolPromise } = require("../config/db");
const { getCurrentVietnamTime, toVietnamTimeString } = require("../utils/time");

class OrderService {
  // Tạo đơn hàng mới với transaction
  async createOrder(userId, orderData) {
    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);

    try {
      await transaction.begin();

      const { items, address, payment_method } = orderData;

      // 1. Validate và tính tổng tiền từ items
      let totalAmount = 0;
      const validatedItems = [];

      for (const item of items) {
        // Kiểm tra dish có tồn tại và available không
        const dishResult = await transaction
          .request()
          .input("dish_id", sql.Int, item.dish_id).query(`
            SELECT dish_id, name, price, is_available 
            FROM Dish 
            WHERE dish_id = @dish_id AND is_available = 1
          `);

        if (dishResult.recordset.length === 0) {
          throw new Error(
            `Dish with ID ${item.dish_id} not found or not available`
          );
        }

        const dish = dishResult.recordset[0];
        const itemTotal = dish.price * item.quantity;
        totalAmount += itemTotal;

        validatedItems.push({
          dish_id: item.dish_id,
          quantity: item.quantity,
          unit_price: dish.price,
          name: dish.name,
        });
      }

      // 2. Tạo đơn hàng
      const orderResult = await transaction
        .request()
        .input("user_id", sql.Int, userId)
        .input("total_amount", sql.Int, totalAmount)
        .input("payment_method", sql.VarChar(10), payment_method)
        .input("created_at", sql.DateTime, getCurrentVietnamTime())
        .input("updated_at", sql.DateTime, getCurrentVietnamTime()).query(`
          INSERT INTO [Order] (user_id, status, total_amount, payment_method, created_at, updated_at)
          OUTPUT INSERTED.order_id
          VALUES (@user_id, 'preparing', @total_amount, @payment_method, @created_at, @updated_at)
        `);

      const orderId = orderResult.recordset[0].order_id;

      // 3. Tạo order items
      for (const item of validatedItems) {
        await transaction
          .request()
          .input("order_id", sql.Int, orderId)
          .input("dish_id", sql.Int, item.dish_id)
          .input("quantity", sql.Int, item.quantity)
          .input("unit_price", sql.Int, item.unit_price).query(`
            INSERT INTO OrderItem (order_id, dish_id, quantity, unit_price)
            VALUES (@order_id, @dish_id, @quantity, @unit_price)
          `);
      }

      // 4. Tạo payment record
      await transaction
        .request()
        .input("order_id", sql.Int, orderId)
        .input("amount", sql.Int, totalAmount)
        .input("payment_method", sql.VarChar(10), payment_method)
        .input("status", sql.VarChar(10), "pending").query(`
          INSERT INTO Payment (order_id, amount, payment_method, status)
          VALUES (@order_id, @amount, @payment_method, @status)
        `);

      // 5. Tạo delivery log
      await transaction
        .request()
        .input("order_id", sql.Int, orderId)
        .input("status", sql.VarChar(20), "preparing")
        .input("timestamp", sql.DateTime, getCurrentVietnamTime())
        .input("note", sql.NVarChar, "Bắt đầu chuẩn bị đơn hàng").query(`
          INSERT INTO DeliveryLog (order_id, status, timestamp, note)
          VALUES (@order_id, @status, @timestamp, @note)
        `);

      await transaction.commit();

      return {
        order_id: orderId,
        total_amount: totalAmount,
        items: validatedItems,
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Lấy lịch sử đơn hàng của user
  async getOrderHistory(userId, page = 1, limit = 10) {
    const pool = await poolPromise;
    const offset = (page - 1) * limit;

    const result = await pool
      .request()
      .input("user_id", sql.Int, userId)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit).query(`
        SELECT 
          o.order_id,
          o.status,
          o.total_amount,
          o.payment_method,
          o.created_at,
          o.updated_at,
          COUNT(oi.order_item_id) as item_count
        FROM [Order] o
        LEFT JOIN OrderItem oi ON o.order_id = oi.order_id
        WHERE o.user_id = @user_id
        GROUP BY o.order_id, o.status, o.total_amount, o.payment_method, o.created_at, o.updated_at
        ORDER BY o.created_at DESC
        OFFSET @offset ROWS
        FETCH NEXT @limit ROWS ONLY
      `);

    // Lấy tổng số đơn hàng
    const countResult = await pool.request().input("user_id", sql.Int, userId)
      .query(`
        SELECT COUNT(*) as total
        FROM [Order]
        WHERE user_id = @user_id
      `);

    const total = countResult.recordset[0].total;
    const totalPages = Math.ceil(total / limit);

    return {
      orders: result.recordset.map((order) => ({
        ...order,
        created_at: toVietnamTimeString(order.created_at),
        updated_at: toVietnamTimeString(order.updated_at),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  // Lấy chi tiết đơn hàng
  async getOrderDetail(orderId, userId) {
    const pool = await poolPromise;

    // 1. Lấy thông tin đơn hàng
    const orderResult = await pool
      .request()
      .input("order_id", sql.Int, orderId)
      .input("user_id", sql.Int, userId).query(`
        SELECT 
          order_id,
          status,
          total_amount,
          payment_method,
          created_at,
          updated_at
        FROM [Order]
        WHERE order_id = @order_id AND user_id = @user_id
      `);

    if (orderResult.recordset.length === 0) {
      return null;
    }

    const order = orderResult.recordset[0];

    // 2. Lấy danh sách items
    const itemsResult = await pool.request().input("order_id", sql.Int, orderId)
      .query(`
        SELECT 
          oi.order_item_id,
          oi.dish_id,
          oi.quantity,
          oi.unit_price,
          d.name as dish_name,
          d.description as dish_description,
          d.image_url as dish_image
        FROM OrderItem oi
        JOIN Dish d ON oi.dish_id = d.dish_id
        WHERE oi.order_id = @order_id
      `);

    // 3. Lấy delivery logs
    const logsResult = await pool.request().input("order_id", sql.Int, orderId)
      .query(`
        SELECT 
          log_id,
          status,
          timestamp,
          note
        FROM DeliveryLog
        WHERE order_id = @order_id
        ORDER BY timestamp ASC
      `);

    return {
      ...order,
      created_at: toVietnamTimeString(order.created_at),
      updated_at: toVietnamTimeString(order.updated_at),
      items: itemsResult.recordset,
      delivery_logs: logsResult.recordset.map((log) => ({
        ...log,
        timestamp: toVietnamTimeString(log.timestamp),
      })),
    };
  }
}

module.exports = new OrderService();
