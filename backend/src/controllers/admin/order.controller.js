const adminOrderService = require("../../services/admin/order.service");

// Lấy toàn bộ đơn hàng, có filter bomb
async function getAllOrders(req, res) {
  try {
    const { bomb } = req.query;
    const orders = await adminOrderService.getAllOrders({ bomb });
    res.json({ success: true, data: orders });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch order list" });
  }
}

// Xác nhận khách hàng bom đơn
async function confirmBombOrder(req, res) {
  try {
    const { orderId } = req.params;
    const result = await adminOrderService.confirmBombOrder(orderId);
    if (result.success) {
      res.json({ success: true, message: "Customer marked as order bomber" });
    } else {
      res
        .status(400)
        .json({ success: false, message: result.message || "Order not found" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to confirm order bomber" });
  }
}

// Gỡ cờ is_flagged cho user
async function unflagUser(req, res) {
  try {
    const { userId } = req.params;
    const result = await adminOrderService.unflagUser(userId);
    if (result.success) {
      res.json({ success: true, message: "User flag removed successfully" });
    } else {
      res
        .status(400)
        .json({ success: false, message: result.message || "User not found" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to remove user flag" });
  }
}

module.exports = { getAllOrders, confirmBombOrder, unflagUser };
