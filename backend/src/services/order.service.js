const { sql, poolPromise } = require("../config/db");
const {
  getCurrentVietnamTime,
  toVietnamTimeString,
  fixDateTimeVN,
} = require("../utils/time");

// Chỉ giữ lại các hàm cho user:
exports.createOrder = async (userId, orderData) => {
  const pool = await poolPromise;
  const transaction = new sql.Transaction(pool);
  try {
    await transaction.begin();
    const { items, address, payment_method } = orderData;
    let totalAmount = 0;
    const validatedItems = [];
    for (const item of items) {
      // Kiểm tra dish có tồn tại và lấy giá
      const dishResult = await transaction
        .request()
        .input("dish_id", sql.Int, item.dish_id)
        .query(
          "SELECT dish_id, name, price, is_available FROM Dish WHERE dish_id = @dish_id AND is_available = 1"
        );
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
    let orderAddress = address;
    if (!orderAddress || orderAddress.trim() === "") {
      // Lấy address hiện tại của user
      const userResult = await transaction
        .request()
        .input("user_id", sql.Int, userId)
        .query("SELECT address FROM [User] WHERE user_id = @user_id");
      if (userResult.recordset.length > 0) {
        orderAddress = userResult.recordset[0].address || null;
      } else {
        orderAddress = null;
      }
    }
    // ... insert Order ...
    const orderResult = await transaction
      .request()
      .input("user_id", sql.Int, userId)
      .input("address", sql.NVarChar(500), orderAddress)
      .input("total_amount", sql.Int, totalAmount)
      .input("payment_method", sql.VarChar(10), payment_method)
      .input("created_at", sql.DateTime, new Date())
      .input("updated_at", sql.DateTime, new Date()).query(`
          INSERT INTO [Order] (user_id, address, status, total_amount, payment_method, created_at, updated_at)
          OUTPUT INSERTED.order_id
          VALUES (@user_id, @address, 'preparing', @total_amount, @payment_method, @created_at, @updated_at)
        `);
    const orderId = orderResult.recordset[0].order_id;
    // Insert từng món vào OrderItem
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
    // ... insert OrderItem, Payment, DeliveryLog ...
    // Bổ sung: insert vào Shipping
    await transaction
      .request()
      .input("order_id", sql.Int, orderId)
      .input("current_status", sql.VarChar(20), "pending") // Sửa thành 'pending' cho hợp lệ
      .input("updated_at", sql.DateTime, new Date()).query(`
        INSERT INTO Shipping (order_id, shipper_id, current_status, updated_at)
        VALUES (@order_id, NULL, @current_status, @updated_at)
        `);
    // ... commit transaction ...
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
};

exports.getOrderHistory = async (userId, page = 1, limit = 10) => {
  const pool = await poolPromise;
  const offset = (page - 1) * limit;
  // Lấy tổng số đơn hàng
  const totalResult = await pool
    .request()
    .input("user_id", sql.Int, userId)
    .query("SELECT COUNT(*) AS total FROM [Order] WHERE user_id = @user_id");
  const total = totalResult.recordset[0].total;
  if (total === 0) {
    return {
      orders: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0,
      },
    };
  }
  // Lấy danh sách đơn hàng phân trang
  const ordersResult = await pool
    .request()
    .input("user_id", sql.Int, userId)
    .input("limit", sql.Int, limit)
    .input("offset", sql.Int, offset).query(`
      SELECT o.order_id, o.total_amount, o.payment_method, o.created_at, o.updated_at, o.address,
        (SELECT TOP 1 dl.status FROM DeliveryLog dl WHERE dl.order_id = o.order_id ORDER BY dl.timestamp DESC) AS status,
        (SELECT COUNT(*) FROM OrderItem oi WHERE oi.order_id = o.order_id) AS item_count
      FROM [Order] o
      WHERE o.user_id = @user_id
      ORDER BY o.created_at DESC
      OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
    `);
  const orders = ordersResult.recordset.map((row) => ({
    order_id: row.order_id,
    status: row.status || "preparing",
    total_amount: row.total_amount,
    payment_method: row.payment_method,
    address: row.address,
    updated_at: toVietnamTimeString(row.updated_at),
    created_at: toVietnamTimeString(row.created_at),
    item_count: row.item_count,
  }));
  return {
    orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

exports.getOrderDetail = async (orderId, role, id) => {
  const pool = await poolPromise;
  let orderResult;
  if (role === "user") {
    // Kiểm tra đơn hàng có thuộc user không
    orderResult = await pool
      .request()
      .input("order_id", sql.Int, orderId)
      .input("user_id", sql.Int, id).query(`
        SELECT * FROM [Order] WHERE order_id = @order_id AND user_id = @user_id
      `);
    if (orderResult.recordset.length === 0) {
      return null;
    }
  } else if (role === "shipper") {
    // Kiểm tra đơn hàng có thuộc shipper không (Shipping)
    const shippingResult = await pool
      .request()
      .input("order_id", sql.Int, orderId)
      .input("shipper_id", sql.Int, id).query(`
        SELECT * FROM Shipping WHERE order_id = @order_id AND shipper_id = @shipper_id
      `);
    if (shippingResult.recordset.length === 0) {
      return null;
    }
    // Lấy order
    orderResult = await pool
      .request()
      .input("order_id", sql.Int, orderId)
      .query(`SELECT * FROM [Order] WHERE order_id = @order_id`);
    if (orderResult.recordset.length === 0) {
      return null;
    }
  } else {
    // Không đúng quyền
    return null;
  }
  const order = orderResult.recordset[0];
  // Lấy danh sách món ăn
  const itemsResult = await pool.request().input("order_id", sql.Int, orderId)
    .query(`
      SELECT oi.order_item_id, oi.dish_id, oi.quantity, oi.unit_price,
        d.name AS dish_name, d.description AS dish_description, d.image_url AS dish_image
      FROM OrderItem oi
      JOIN Dish d ON oi.dish_id = d.dish_id
      WHERE oi.order_id = @order_id
    `);
  const items = itemsResult.recordset.map((item) => ({
    order_item_id: item.order_item_id,
    dish_id: item.dish_id,
    quantity: item.quantity,
    unit_price: item.unit_price,
    dish_name: item.dish_name,
    dish_description: item.dish_description,
    dish_image: item.dish_image,
  }));
  // Lấy log giao hàng
  const logsResult = await pool.request().input("order_id", sql.Int, orderId)
    .query(`
      SELECT log_id, status, timestamp, note FROM DeliveryLog WHERE order_id = @order_id ORDER BY timestamp ASC
    `);
  const delivery_logs = logsResult.recordset.map((log) => ({
    log_id: log.log_id,
    status: log.status,
    timestamp: toVietnamTimeString(log.timestamp),
    note: log.note,
  }));
  // Lấy thông tin shipper (nếu có)
  const shippingResult = await pool
    .request()
    .input("order_id", sql.Int, orderId).query(`
      SELECT s.current_status, s.updated_at, sh.shipper_id, sh.full_name, sh.phone, sh.email
      FROM Shipping s
      LEFT JOIN Shipper sh ON s.shipper_id = sh.shipper_id
      WHERE s.order_id = @order_id
    `);
  let shipper = null;
  if (shippingResult.recordset.length > 0) {
    const s = shippingResult.recordset[0];
    if (s.shipper_id) {
      shipper = {
        shipper_id: s.shipper_id,
        full_name: s.full_name,
        phone: s.phone,
        email: s.email,
        current_status: s.current_status,
        updated_at: toVietnamTimeString(s.updated_at),
      };
    } else {
      shipper = {
        shipper_id: null,
        full_name: null,
        phone: null,
        email: null,
        current_status: s.current_status,
        updated_at: toVietnamTimeString(s.updated_at),
      };
    }
  }
  // Trong getOrderDetail: lấy status từ Shipping
  let status = "pending";
  if (
    shippingResult.recordset.length > 0 &&
    shippingResult.recordset[0].current_status
  ) {
    status = shippingResult.recordset[0].current_status;
  }
  return {
    order_id: order.order_id,
    status,
    total_amount: order.total_amount,
    payment_method: order.payment_method,
    address: order.address,
    created_at: toVietnamTimeString(order.created_at),
    updated_at: toVietnamTimeString(order.updated_at),
    items,
    delivery_logs,
    shipper,
  };
};

exports.getOrdersByShipperId = async (shipperId, page = 1, limit = 10) => {
  const pool = await poolPromise;
  const offset = (page - 1) * limit;
  // Lấy tổng số đơn hàng của shipper
  const totalResult = await pool
    .request()
    .input("shipper_id", sql.Int, shipperId)
    .query(
      "SELECT COUNT(*) AS total FROM Shipping WHERE shipper_id = @shipper_id"
    );
  const total = totalResult.recordset[0].total;
  if (total === 0) {
    return {
      orders: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0,
      },
    };
  }
  // Lấy danh sách đơn hàng phân trang
  const ordersResult = await pool
    .request()
    .input("shipper_id", sql.Int, shipperId)
    .input("limit", sql.Int, limit)
    .input("offset", sql.Int, offset).query(`
      SELECT o.order_id, o.total_amount, o.payment_method, o.created_at, o.updated_at, o.address,
        s.current_status AS status,
        (SELECT COUNT(*) FROM OrderItem oi WHERE oi.order_id = o.order_id) AS item_count
      FROM Shipping s
      JOIN [Order] o ON s.order_id = o.order_id
      WHERE s.shipper_id = @shipper_id
      ORDER BY o.created_at DESC
      OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
    `);
  const orders = ordersResult.recordset.map((row) => ({
    order_id: row.order_id,
    status: row.status || "preparing",
    total_amount: row.total_amount,
    payment_method: row.payment_method,
    address: row.address,
    updated_at: toVietnamTimeString(row.updated_at),
    created_at: toVietnamTimeString(row.created_at),
    item_count: row.item_count,
  }));
  return {
    orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
