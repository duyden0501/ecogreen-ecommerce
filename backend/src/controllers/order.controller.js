// [TV 3] Tạo đơn, hủy đơn hàng
import * as orderService from '../services/order.service.js';

// POST /api/orders
export const createOrder = async (req, res, next) => {
  try {
    const { paymentMethod, shippingAddress, voucherCode } = req.body;
    const order = await orderService.createOrder(req.user.id, { paymentMethod, shippingAddress, voucherCode });
    res.status(201).json({ success: true, message: 'Đặt hàng thành công!', data: order });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders
export const getMyOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const result = await orderService.getUserOrders(req.user.id, { page: Number(page), limit: Number(limit), status });
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/:id
export const getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id, req.user.id);
    if (!order) return res.status(404).json({ success: false, message: 'Đơn hàng không tồn tại.' });
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/orders/:id/cancel
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await orderService.cancelOrder(req.params.id, req.user.id);
    res.json({ success: true, message: 'Đã hủy đơn hàng.', data: order });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/orders — [Admin Only]
export const getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const result = await orderService.getAllOrders({ page: Number(page), limit: Number(limit), status });
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/orders/:id/status — [Admin Only]
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await orderService.updateOrderStatus(req.params.id, status);
    res.json({ success: true, message: 'Cập nhật trạng thái đơn hàng thành công!', data: order });
  } catch (error) {
    next(error);
  }
};
