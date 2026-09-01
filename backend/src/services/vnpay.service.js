// [TV 4] Sinh URL băm mật mã SHA-512
import qs from 'querystring';
import vnpayConfig from '../config/vnpay.config.js';
import { createHmacSHA512 } from '../utils/vnpay.util.js';

export const createPaymentUrl = ({ orderId, amount, orderInfo, ipAddr }) => {
  const date = new Date();
  const createDate = date.toISOString().replace(/[-:T.]/g, '').slice(0, 14);

  const params = {
    vnp_Version: vnpayConfig.version,
    vnp_Command: vnpayConfig.command,
    vnp_TmnCode: vnpayConfig.tmnCode,
    vnp_Locale: vnpayConfig.locale,
    vnp_CurrCode: vnpayConfig.currCode,
    vnp_TxnRef: orderId,
    vnp_OrderInfo: orderInfo || `Thanh toan don hang ${orderId}`,
    vnp_OrderType: vnpayConfig.orderType,
    vnp_Amount: amount * 100, // VNPay tính đơn vị x100
    vnp_ReturnUrl: vnpayConfig.returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  const sortedParams = Object.fromEntries(Object.entries(params).sort());
  const signData = qs.stringify(sortedParams, { encode: false });
  const secureHash = createHmacSHA512(vnpayConfig.hashSecret, signData);

  return `${vnpayConfig.url}?${qs.stringify(sortedParams)}&vnp_SecureHash=${secureHash}`;
};

export const confirmPayment = async (txnRef) => {
  const { default: prisma } = await import('../config/db.js');
  return prisma.order.updateMany({
    where: { vnpayTxnRef: txnRef },
    data: { paymentStatus: 'PAID', status: 'CONFIRMED' },
  });
};

export const processIpn = async ({ vnpResponseCode, vnpTxnRef, vnpAmount }) => {
  const { default: prisma } = await import('../config/db.js');
  const order = await prisma.order.findFirst({ where: { vnpayTxnRef: vnpTxnRef } });

  if (!order) return { RspCode: '01', Message: 'Order not found' };
  if (order.paymentStatus === 'PAID') return { RspCode: '02', Message: 'Order already confirmed' };
  if (order.totalAmount * 100 !== Number(vnpAmount)) return { RspCode: '04', Message: 'Invalid amount' };

  if (vnpResponseCode === '00') {
    await prisma.order.update({ where: { id: order.id }, data: { paymentStatus: 'PAID', status: 'CONFIRMED' } });
    return { RspCode: '00', Message: 'Confirm Success' };
  }

  await prisma.order.update({ where: { id: order.id }, data: { paymentStatus: 'FAILED' } });
  return { RspCode: '00', Message: 'Confirm Success' };
};
