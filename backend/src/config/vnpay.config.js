// [TV 4] Cấu hình khóa bảo mật VNPay Sandbox
const vnpayConfig = {
  tmnCode: process.env.VNPAY_TMN_CODE || '',
  hashSecret: process.env.VNPAY_HASH_SECRET || '',
  url: process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  returnUrl: process.env.VNPAY_RETURN_URL || 'http://localhost:3000/payment-result',
  apiUrl: 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction',
  version: '2.1.0',
  command: 'pay',
  currCode: 'VND',
  locale: 'vn',
  orderType: 'other',
};

export default vnpayConfig;
