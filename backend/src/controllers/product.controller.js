// [TV 2] Tìm kiếm, lọc sản phẩm xanh
import * as productService from '../services/product.service.js';

// GET /api/products
export const getProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, search, category, material, minPrice, maxPrice, sortBy = 'createdAt', order = 'desc' } = req.query;
    const result = await productService.getProducts({ page: Number(page), limit: Number(limit), search, category, material, minPrice, maxPrice, sortBy, order });
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:slug
export const getProductBySlug = async (req, res, next) => {
  try {
    const product = await productService.getProductBySlug(req.params.slug);
    if (!product) return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại.' });
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/products — [Admin Only]
export const createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json({ success: true, message: 'Tạo sản phẩm thành công!', data: product });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/products/:id — [Admin Only]
export const updateProduct = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.json({ success: true, message: 'Cập nhật sản phẩm thành công!', data: product });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/products/:id — [Admin Only]
export const deleteProduct = async (req, res, next) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.json({ success: true, message: 'Đã xóa sản phẩm.' });
  } catch (error) {
    next(error);
  }
};
