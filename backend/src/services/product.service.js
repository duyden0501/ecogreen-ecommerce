// [TV 2] Truy vấn CSDL sản phẩm & kho hàng
import prisma from '../config/db.js';

export const getProducts = async ({ page, limit, search, category, material, minPrice, maxPrice, sortBy, order }) => {
  const where = { isActive: true };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (category) where.category = { slug: category };
  if (material) where.material = { contains: material, mode: 'insensitive' };
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = Number(minPrice);
    if (maxPrice) where.price.lte = Number(maxPrice);
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: { select: { name: true, slug: true } } },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: order },
    }),
    prisma.product.count({ where }),
  ]);

  return { data: products, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

export const getProductBySlug = async (slug) => {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      reviews: { include: { user: { select: { name: true } } }, orderBy: { createdAt: 'desc' }, take: 10 },
    },
  });
};

export const createProduct = async (data) => {
  return prisma.product.create({ data });
};

export const updateProduct = async (id, data) => {
  return prisma.product.update({ where: { id }, data });
};

export const deleteProduct = async (id) => {
  return prisma.product.update({ where: { id }, data: { isActive: false } }); // Soft delete
};
