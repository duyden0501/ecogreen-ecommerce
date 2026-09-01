// [TV 3] Thêm, sửa, xóa giỏ hàng
import * as cartService from '../services/cart.service.js';

// GET /api/cart
export const getCart = async (req, res, next) => {
  try {
    const cart = await cartService.getCart(req.user.id);
    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// POST /api/cart
export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const cart = await cartService.addToCart(req.user.id, productId, Number(quantity));
    res.json({ success: true, message: 'Đã thêm vào giỏ hàng!', data: cart });
  } catch (error) {
    next(error);
  }
};

// PUT /api/cart/:productId
export const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const cart = await cartService.updateCartItem(req.user.id, req.params.productId, Number(quantity));
    res.json({ success: true, message: 'Đã cập nhật giỏ hàng!', data: cart });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/cart/:productId
export const removeFromCart = async (req, res, next) => {
  try {
    await cartService.removeFromCart(req.user.id, req.params.productId);
    res.json({ success: true, message: 'Đã xóa sản phẩm khỏi giỏ hàng.' });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/cart
export const clearCart = async (req, res, next) => {
  try {
    await cartService.clearCart(req.user.id);
    res.json({ success: true, message: 'Đã xóa toàn bộ giỏ hàng.' });
  } catch (error) {
    next(error);
  }
};
