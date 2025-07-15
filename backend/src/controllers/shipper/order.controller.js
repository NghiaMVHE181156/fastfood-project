const shipperService = require("../../services/shipper/order.service");

console.log("Order controller loaded");

// GET /shipper/orders/available
async function getAvailableOrders(req, res) {
  try {
    const orders = await shipperService.getAvailableOrders();
    return res.json({
      success: true,
      message: "Get available orders successfully",
      data: orders,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to get available orders",
      error: { code: "INTERNAL_SERVER_ERROR", details: err.message },
    });
  }
}

// POST /shipper/orders/:id/assign
async function assignOrderToShipper(req, res) {
  try {
    const orderId = parseInt(req.params.id);
    const shipperId = req.user.id;
    const result = await shipperService.assignOrderToShipper(
      orderId,
      shipperId
    );
    if (result && result.success) {
      return res.json({ success: true, message: "Order assigned to shipper" });
    } else {
      return res.status(403).json({
        success: false,
        message: "Order not found or not assigned to you",
        error: { code: "UNAUTHORIZED_ORDER_ACCESS" },
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Order not found or not assigned to you",
      error: { code: "UNAUTHORIZED_ORDER_ACCESS" },
    });
  }
}

// PATCH /shipper/orders/:id/onway
async function updateOrderOnWay(req, res) {
  try {
    const orderId = parseInt(req.params.id);
    const shipperId = req.user.id;
    const result = await shipperService.updateOrderOnWay(orderId, shipperId);
    if (result && result.success) {
      return res.json({ success: true, message: "Order is now on the way" });
    } else {
      return res.status(403).json({
        success: false,
        message: "Order not found or not assigned to you or not pending",
        error: { code: "UNAUTHORIZED_ORDER_ACCESS" },
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Order not found or not assigned to you or not pending",
      error: { code: "UNAUTHORIZED_ORDER_ACCESS" },
    });
  }
}

// PATCH /shipper/orders/:id/delivered
async function updateOrderDelivered(req, res) {
  try {
    const orderId = parseInt(req.params.id);
    const shipperId = req.user.id;
    const result = await shipperService.updateOrderDelivered(
      orderId,
      shipperId
    );
    if (result && result.success) {
      return res.json({
        success: true,
        message: "Order delivered successfully",
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "Order not found or not assigned to you or not on way",
        error: { code: "UNAUTHORIZED_ORDER_ACCESS" },
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Order not found or not assigned to you or not on way",
      error: { code: "UNAUTHORIZED_ORDER_ACCESS" },
    });
  }
}

// PATCH /shipper/orders/:id/failed1
async function updateOrderFailed1(req, res) {
  console.log("[DEBUG] Đã vào controller updateOrderFailed1");
  try {
    const orderId = parseInt(req.params.id);
    console.log("[DEBUG] orderId:", orderId);
    console.log("[DEBUG] req.user:", req.user);
    const shipperId = req.user && req.user.id;
    const { note } = req.body || {};
    console.log("[DEBUG] shipperId:", shipperId, "note:", note);
    // Debug log
    console.log("[DEBUG] PATCH /shipper/orders/:id/failed1", {
      orderId,
      shipperId,
      note,
    });
    console.log("[DEBUG] req.user:", req.user);
    const result = await shipperService.updateOrderFailed1(
      orderId,
      shipperId,
      note
    );
    // Debug log kết quả trả về từ service
    console.log("[DEBUG] Result from updateOrderFailed1", result);
    if (result && result.success) {
      return res.json({
        success: true,
        message: "First delivery failure recorded",
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "Order not found or not assigned to you or not on way",
        error: { code: "UNAUTHORIZED_ORDER_ACCESS" },
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Order not found or not assigned to you or not on way",
      error: { code: "UNAUTHORIZED_ORDER_ACCESS" },
    });
  }
}

// PATCH /shipper/orders/:id/redelivery
async function updateOrderRedelivery(req, res) {
  try {
    const orderId = parseInt(req.params.id);
    const shipperId = req.user.id;
    const { note } = req.body || {};
    const result = await shipperService.updateOrderRedelivery(
      orderId,
      shipperId,
      note
    );
    if (result && result.success) {
      return res.json({ success: true, message: "Redelivery started" });
    } else {
      return res.status(403).json({
        success: false,
        message: "Order not found or not assigned to you or not failed",
        error: { code: "UNAUTHORIZED_ORDER_ACCESS" },
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Order not found or not assigned to you or not failed",
      error: { code: "UNAUTHORIZED_ORDER_ACCESS" },
    });
  }
}

// PATCH /shipper/orders/:id/redelivered
async function updateOrderRedelivered(req, res) {
  try {
    const orderId = parseInt(req.params.id);
    const shipperId = req.user.id;
    const result = await shipperService.updateOrderRedelivered(
      orderId,
      shipperId
    );
    if (result && result.success) {
      return res.json({
        success: true,
        message: "Order redelivered successfully",
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "Order not found or not assigned to you or not returned",
        error: { code: "UNAUTHORIZED_ORDER_ACCESS" },
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Order not found or not assigned to you or not returned",
      error: { code: "UNAUTHORIZED_ORDER_ACCESS" },
    });
  }
}

// PATCH /shipper/orders/:id/failed2
async function updateOrderFailed2(req, res) {
  try {
    const orderId = parseInt(req.params.id);
    const shipperId = req.user.id;
    const { note } = req.body || {};
    const result = await shipperService.updateOrderFailed2(
      orderId,
      shipperId,
      note
    );
    if (result && result.success) {
      return res.json({
        success: true,
        message: "Final delivery failed, order marked as bomb",
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "Order not found or not assigned to you or not returned",
        error: { code: "UNAUTHORIZED_ORDER_ACCESS" },
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Order not found or not assigned to you or not returned",
      error: { code: "UNAUTHORIZED_ORDER_ACCESS" },
    });
  }
}

module.exports = {
  getAvailableOrders,
  assignOrderToShipper,
  updateOrderOnWay,
  updateOrderDelivered,
  updateOrderFailed1,
  updateOrderRedelivery,
  updateOrderRedelivered,
  updateOrderFailed2,
};
