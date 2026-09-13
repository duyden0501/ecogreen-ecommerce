import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById } from '../services/orderApi';
import { getPaymentForOrder, payNow, updatePaymentMethod } from '../services/paymentApi';
import './Payment.css';

// Thông tin ngân hàng EcoGreen (VietQR)
const BANK_INFO = {
  bankCode: 'MB',        // MBBank - đổi theo ngân hàng thật của bạn
  accountNo: '0123456789',
  accountName: 'CONG TY ECOGREEN',
};

const METHODS = [
  {
    id: 'VIETQR',
    icon: '🏦',
    label: 'Chuyển khoản ngân hàng',
    desc: 'Quét mã QR bằng app ngân hàng bất kỳ',
  },
  {
    id: 'MOMO',
    icon: '🟣',
    label: 'Ví MoMo',
    desc: 'Quét mã QR bằng app MoMo',
  },
  {
    id: 'COD',
    icon: '💵',
    label: 'Thanh toán khi nhận hàng (COD)',
    desc: 'Không cần thanh toán trước',
  },
];

const fmtVND = (n) => Number(n).toLocaleString('vi-VN') + '₫';

const Payment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState('VIETQR');
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [o, p] = await Promise.all([getOrderById(orderId), getPaymentForOrder(orderId)]);
      setOrder(o);
      setPayment(p);
      if (p?.paymentMethod) setSelectedMethod(p.paymentMethod);
    } catch (err) {
      setError(err.friendlyMessage || 'Không thể tải thông tin đơn hàng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [orderId]); // eslint-disable-line

  const handleSelectMethod = async (methodId) => {
    setSelectedMethod(methodId);
    try {
      await updatePaymentMethod(orderId, methodId);
    } catch (err) {
      console.warn('Could not sync payment method:', err);
    }
  };

  const handlePay = async () => {
    setPaying(true);
    setError('');
    try {
      try {
        await updatePaymentMethod(orderId, selectedMethod);
      } catch (ignored) {}
      await payNow(orderId);
      navigate(`/order-success/${orderId}`);
    } catch (err) {
      setError(err.friendlyMessage || 'Thanh toán thất bại. Vui lòng thử lại.');
    } finally {
      setPaying(false);
    }
  };

  // Build VietQR URL dynamically
  const getVietQRUrl = () => {
    const amount = payment?.amount || order?.totalAmount || 0;
    const desc = `ECOGREEN ${orderId}`;
    return `https://img.vietqr.io/image/${BANK_INFO.bankCode}-${BANK_INFO.accountNo}-compact2.jpg?amount=${amount}&addInfo=${encodeURIComponent(desc)}&accountName=${encodeURIComponent(BANK_INFO.accountName)}`;
  };

  if (loading) return <div className="pay-loading"><div className="spinner" /></div>;
  if (error && !order) return <p className="pay-error-full">{error}</p>;

  const amount = payment?.amount || order?.totalAmount || 0;
  const alreadyPaid = payment?.status === 'SUCCESS';

  return (
    <div className="pay-page">
      <div className="pay-wrapper">

        {/* Left: Method selector */}
        <div className="pay-left">
          <h1 className="pay-heading">Thanh toán đơn #{orderId}</h1>
          <p className="pay-amount-label">Tổng thanh toán</p>
          <p className="pay-amount">{fmtVND(amount)}</p>

          <p className="pay-choose-label">Chọn phương thức thanh toán</p>
          <div className="pay-methods">
            {METHODS.map((m) => (
              <button
                key={m.id}
                className={`pay-method-btn ${selectedMethod === m.id ? 'active' : ''}`}
                onClick={() => handleSelectMethod(m.id)}
                disabled={alreadyPaid}
              >
                <span className="pay-method-icon">{m.icon}</span>
                <span className="pay-method-info">
                  <strong>{m.label}</strong>
                  <small>{m.desc}</small>
                </span>
                {selectedMethod === m.id && <span className="pay-method-check">✓</span>}
              </button>
            ))}
          </div>

          {error && <p className="pay-error">{error}</p>}

          {alreadyPaid ? (
            <div className="pay-success-badge">✅ Đơn hàng này đã được thanh toán</div>
          ) : (
            <button
              className="pay-confirm-btn"
              onClick={handlePay}
              disabled={paying}
            >
              {paying ? 'Đang xử lý...' : selectedMethod === 'COD' ? 'Xác nhận đặt hàng (COD)' : 'Xác nhận đã chuyển khoản'}
            </button>
          )}
        </div>

        {/* Right: QR / Instructions */}
        <div className="pay-right">
          {selectedMethod === 'VIETQR' && (
            <div className="pay-qr-box">
              <p className="pay-qr-title">🏦 Quét mã QR để chuyển khoản</p>
              <img
                src={getVietQRUrl()}
                alt="VietQR chuyển khoản"
                className="pay-qr-img"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div className="pay-bank-info">
                <div className="pay-bank-row"><span>Ngân hàng</span><strong>MBBank</strong></div>
                <div className="pay-bank-row"><span>Số tài khoản</span><strong>{BANK_INFO.accountNo}</strong></div>
                <div className="pay-bank-row"><span>Chủ tài khoản</span><strong>{BANK_INFO.accountName}</strong></div>
                <div className="pay-bank-row"><span>Số tiền</span><strong className="pay-bank-amount">{fmtVND(amount)}</strong></div>
                <div className="pay-bank-row"><span>Nội dung CK</span><strong>ECOGREEN {orderId}</strong></div>
              </div>
              <p className="pay-note">💡 Sau khi chuyển khoản, bấm <em>"Xác nhận đã chuyển khoản"</em> bên trái</p>
            </div>
          )}

          {selectedMethod === 'MOMO' && (
            <div className="pay-qr-box pay-qr-box--momo">
              <p className="pay-qr-title">🟣 Chuyển khoản qua MoMo</p>
              <div className="pay-momo-steps">
                <div className="pay-momo-step"><span>1</span><p>Mở app <strong>MoMo</strong> → Chọn <strong>"Chuyển tiền"</strong></p></div>
                <div className="pay-momo-step"><span>2</span><p>Nhập số điện thoại: <strong>0987 654 321</strong></p></div>
                <div className="pay-momo-step"><span>3</span><p>Nhập số tiền: <strong>{fmtVND(amount)}</strong></p></div>
                <div className="pay-momo-step"><span>4</span><p>Nội dung: <strong>ECOGREEN {orderId}</strong></p></div>
                <div className="pay-momo-step"><span>5</span><p>Xác nhận và gửi tiền</p></div>
              </div>
              <p className="pay-note">💡 Sau khi chuyển khoản, bấm <em>"Xác nhận đã chuyển khoản"</em> bên trái</p>
            </div>
          )}

          {selectedMethod === 'COD' && (
            <div className="pay-qr-box pay-qr-box--cod">
              <div className="pay-cod-icon">💵</div>
              <h3>Thanh toán khi nhận hàng</h3>
              <p>Bạn sẽ thanh toán <strong>{fmtVND(amount)}</strong> cho nhân viên giao hàng khi nhận sản phẩm.</p>
              <ul className="pay-cod-list">
                <li>✅ Không cần chuyển khoản trước</li>
                <li>✅ Kiểm tra hàng trước khi nhận</li>
                <li>✅ Giao hàng trong 2–5 ngày làm việc</li>
              </ul>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Payment;
