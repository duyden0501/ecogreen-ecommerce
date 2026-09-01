// [TV 1] Gửi mail OTP qua NodeMailer
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOtpEmail = async (email, otpCode) => {
  const mailOptions = {
    from: `"🌿 EcoGreen" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Mã xác thực OTP – EcoGreen',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background: #f0fdf4; border-radius: 12px;">
        <h2 style="color: #166534; text-align: center;">🌿 EcoGreen</h2>
        <p style="color: #374151;">Xin chào,</p>
        <p style="color: #374151;">Mã OTP xác thực tài khoản của bạn là:</p>
        <div style="text-align: center; margin: 24px 0;">
          <span style="font-size: 36px; font-weight: bold; color: #15803d; letter-spacing: 8px; background: #dcfce7; padding: 12px 24px; border-radius: 8px;">
            ${otpCode}
          </span>
        </div>
        <p style="color: #6b7280; font-size: 14px;">Mã OTP có hiệu lực trong <strong>10 phút</strong>. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
        <hr style="border-color: #bbf7d0; margin: 20px 0;">
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">© 2024 EcoGreen — Sống Xanh, Mua Sắm Xanh</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendOrderConfirmEmail = async (email, order) => {
  const mailOptions = {
    from: `"🌿 EcoGreen" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `Xác nhận đơn hàng #${order.id.slice(-8).toUpperCase()} – EcoGreen`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #166534;">🌿 Đơn hàng đã được xác nhận!</h2>
        <p>Cảm ơn bạn đã mua sắm tại EcoGreen. Đơn hàng của bạn đang được xử lý.</p>
        <p><strong>Mã đơn:</strong> #${order.id.slice(-8).toUpperCase()}</p>
        <p><strong>Tổng tiền:</strong> ${order.totalAmount.toLocaleString('vi-VN')} VNĐ</p>
        <p><strong>CO₂ đã tiết kiệm:</strong> ${order.totalCo2Saved} kg 🌍</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
