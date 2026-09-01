// [TV 6] Thuật toán tính CO2 giảm phát thải
/**
 * Tính tổng CO2 tiết kiệm từ danh sách sản phẩm trong giỏ hàng.
 *
 * Công thức:
 *   totalCo2Saved = Σ (product.co2SavedPerUnit × quantity)
 *
 * @param {Array<{product: {co2SavedPerUnit: number}, quantity: number}>} cartItems
 * @returns {number} kg CO2 đã tiết kiệm (làm tròn 2 chữ số thập phân)
 */
export const calculateCo2Saved = (cartItems) => {
  const total = cartItems.reduce((sum, item) => {
    const co2PerUnit = item.product?.co2SavedPerUnit || 0;
    return sum + co2PerUnit * item.quantity;
  }, 0);
  return Math.round(total * 100) / 100;
};

/**
 * Tính số cây tương đương với lượng CO2 đã tiết kiệm.
 * Trung bình 1 cây hấp thụ 21kg CO2/năm.
 *
 * @param {number} co2Kg - kg CO2 đã tiết kiệm
 * @returns {number} Số cây tương đương
 */
export const co2ToTrees = (co2Kg) => {
  const CO2_PER_TREE_PER_YEAR = 21; // kg/năm
  return Math.round((co2Kg / CO2_PER_TREE_PER_YEAR) * 100) / 100;
};

/**
 * Tính số km lái xe tương đương với lượng CO2 đã tiết kiệm.
 * Trung bình xe hơi thải 0.21 kg CO2/km.
 *
 * @param {number} co2Kg
 * @returns {number} Số km tương đương
 */
export const co2ToCarKm = (co2Kg) => {
  const CO2_PER_CAR_KM = 0.21; // kg/km
  return Math.round(co2Kg / CO2_PER_CAR_KM);
};

/**
 * Tạo thông điệp eco thân thiện từ lượng CO2 tiết kiệm
 * @param {number} co2Kg
 * @returns {string}
 */
export const getEcoMessage = (co2Kg) => {
  if (co2Kg <= 0) return 'Bắt đầu mua sắm xanh để theo dõi tác động môi trường của bạn!';
  const trees = co2ToTrees(co2Kg);
  const km = co2ToCarKm(co2Kg);
  return `Bạn đã tiết kiệm ${co2Kg}kg CO₂ — tương đương trồng ${trees} cây xanh hoặc không lái xe ${km}km! 🌳`;
};
