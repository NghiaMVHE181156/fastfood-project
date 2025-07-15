const orderService = require("../../services/order.service");
const { successResponse, errorResponse } = require("../../utils/response");

// Tạo đơn hàng mới
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderData = {
      items: req.body.items,
      address: req.body.address,
      payment_method: req.body.payment_method,
    };
    // Check if user is flagged and payment_method is COD
    if (orderData.payment_method === "COD") {
      const userService = require("../../services/user.service");
      const isFlagged = await userService.isUserFlagged(userId);
      if (isFlagged) {
        return res.status(403).json({
          success: false,
          message:
            "You are not allowed to use COD payment method due to repeated order bombing.",
          error: { code: "USER_FLAGGED_COD_FORBIDDEN" },
        });
      }
    }
    const result = await orderService.createOrder(userId, orderData);

    return res.status(201).json(
      successResponse("Order created successfully", {
        order_id: result.order_id,
        total_amount: result.total_amount,
        items: result.items,
      })
    );
  } catch (err) {
    console.error("Create order error:", err);

    if (err.message.includes("not found or not available")) {
      return res
        .status(400)
        .json(errorResponse(err.message, "DISH_NOT_AVAILABLE"));
    }

    return res
      .status(500)
      .json(
        errorResponse(
          "Failed to create order",
          "INTERNAL_SERVER_ERROR",
          err.message
        )
      );
  }
};

// Lấy lịch sử đơn hàng của user
exports.getOrderHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await orderService.getOrderHistory(userId, page, limit);

    return res
      .status(200)
      .json(successResponse("Order history retrieved successfully", result));
  } catch (err) {
    console.error("Get order history error:", err);

    return res
      .status(500)
      .json(
        errorResponse(
          "Failed to retrieve order history",
          "INTERNAL_SERVER_ERROR",
          err.message
        )
      );
  }
};

// Lấy chi tiết đơn hàng
exports.getOrderDetail = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = parseInt(req.params.id);

    if (!orderId || isNaN(orderId)) {
      return res
        .status(400)
        .json(errorResponse("Invalid order ID", "INVALID_ORDER_ID"));
    }

    const order = await orderService.getOrderDetail(orderId, userId);

    if (!order) {
      return res
        .status(403)
        .json(
          errorResponse("Order not found or access denied", "ORDER_NOT_FOUND")
        );
    }

    return res
      .status(200)
      .json(successResponse("Order details retrieved successfully", order));
  } catch (err) {
    console.error("Get order detail error:", err);

    return res
      .status(500)
      .json(
        errorResponse(
          "Failed to retrieve order details",
          "INTERNAL_SERVER_ERROR",
          err.message
        )
      );
  }
};
