import React, { useState } from 'react';
import './GoogleOAuthModal.css';

/**
 * GoogleOAuthModal: Recreates the exact Google OAuth 2.0 consent popup
 * shown on Shopee and standard Google Identity flows.
 */
const GoogleOAuthModal = ({ isOpen, onClose, onAuthorize, loading }) => {
  const [selectedAccount, setSelectedAccount] = useState({
    name: '05 Khánh Duy',
    email: 'duymai.4060@gmail.com',
    avatarChar: 'K'
  });
  const [isSwitching, setIsSwitching] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');

  if (!isOpen) return null;

  const handleContinue = () => {
    onAuthorize({
      email: selectedAccount.email,
      name: selectedAccount.name,
      googleId: 'google_oauth_' + Math.abs(selectedAccount.email.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)),
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(selectedAccount.name)}`
    });
  };

  const handleApplyCustomAccount = (e) => {
    e.preventDefault();
    if (!customEmail || !customEmail.includes('@')) return;
    const name = customName.trim() || customEmail.split('@')[0];
    setSelectedAccount({
      name: name,
      email: customEmail.trim().toLowerCase(),
      avatarChar: name.charAt(0).toUpperCase()
    });
    setIsSwitching(false);
  };

  return (
    <div className="google-oauth-overlay" onClick={onClose}>
      <div className="google-oauth-window" onClick={(e) => e.stopPropagation()}>
        {/* Fake Browser / OS Window Bar */}
        <div className="oauth-window-titlebar">
          <div className="oauth-title-left">
            <svg className="google-icon-small" viewBox="0 0 24 24" width="16" height="16">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Đăng nhập - Tài khoản Google</span>
          </div>
          <div className="oauth-window-controls">
            <button className="win-btn win-min" title="Thu nhỏ">─</button>
            <button className="win-btn win-max" title="Phóng to">▢</button>
            <button className="win-btn win-close" onClick={onClose} title="Đóng">✕</button>
          </div>
        </div>

        {/* Browser URL Bar Simulation */}
        <div className="oauth-url-bar">
          <span className="lock-icon">🔒</span>
          <span className="url-text">accounts.google.com/signin/oauth/id?client_id=ecogreen.apps.googleusercontent.com</span>
        </div>

        {/* OAuth Consent Content */}
        <div className="oauth-body-content">
          {/* EcoGreen Branding */}
          <div className="oauth-brand-header">
            <div className="ecogreen-brand-badge">
              <span className="eco-leaf-icon">🌿</span>
              <span className="eco-brand-name">EcoGreen</span>
            </div>
            <h2 className="oauth-prompt-title">Đăng nhập vào EcoGreen</h2>
          </div>

          {/* Account Selector Card */}
          {!isSwitching ? (
            <div className="oauth-account-pill" onClick={() => setIsSwitching(true)} title="Nhấp để đổi tài khoản khác">
              <div className="oauth-avatar-circle">
                {selectedAccount.avatarChar}
              </div>
              <div className="oauth-account-meta">
                <span className="oauth-account-name">{selectedAccount.name}</span>
                <span className="oauth-account-email">{selectedAccount.email}</span>
              </div>
              <span className="oauth-switch-caret">▾</span>
            </div>
          ) : (
            <form onSubmit={handleApplyCustomAccount} className="oauth-switch-form">
              <div className="switch-input-group">
                <label>Họ và tên Google:</label>
                <input
                  type="text"
                  placeholder="VD: Nguyễn Văn A"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="switch-input-group">
                <label>Email Google:</label>
                <input
                  type="email"
                  placeholder="VD: user@gmail.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  required
                />
              </div>
              <div className="switch-actions">
                <button type="button" className="btn-cancel-switch" onClick={() => setIsSwitching(false)}>
                  Quay lại
                </button>
                <button type="submit" className="btn-confirm-switch">
                  Chọn tài khoản này
                </button>
              </div>
            </form>
          )}

          {/* Scopes & Permissions */}
          <div className="oauth-scopes-section">
            <p className="oauth-scopes-intro">
              Google sẽ cho phép <strong>EcoGreen</strong> truy cập vào thông tin này về bạn:
            </p>
            <ul className="oauth-scopes-list">
              <li className="scope-item">
                <span className="scope-icon">👤</span>
                <div className="scope-info">
                  <strong>Tên và ảnh hồ sơ</strong>
                  <span>Họ tên, ảnh đại diện công khai và ngôn ngữ ưa thích của bạn</span>
                </div>
              </li>
              <li className="scope-item">
                <span className="scope-icon">✉️</span>
                <div className="scope-info">
                  <strong>Địa chỉ email</strong>
                  <span>Địa chỉ email chính xác để xác thực tài khoản và gửi hóa đơn điện tử</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Privacy & Legal disclaimer */}
          <div className="oauth-disclaimer">
            <p>
              Xem <a href="#privacy" onClick={(e) => e.preventDefault()}>Chính sách quyền riêng tư</a> và <a href="#terms" onClick={(e) => e.preventDefault()}>Điều khoản dịch vụ</a> của EcoGreen để hiểu cách EcoGreen sẽ xử lý và bảo vệ dữ liệu của bạn.
            </p>
            <p className="oauth-sub-disclaimer">
              Nếu bất cứ lúc nào bạn muốn thực hiện thay đổi, hãy truy cập <a href="#google-account" onClick={(e) => e.preventDefault()}>Tài khoản Google</a> của bạn.
            </p>
            <p className="oauth-learn-more">
              Tìm hiểu thêm về tính năng <a href="#learn-more" onClick={(e) => e.preventDefault()}>Đăng nhập bằng Google</a>.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="oauth-actions-row">
            <button
              type="button"
              className="btn-oauth-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Huỷ
            </button>
            <button
              type="button"
              className="btn-oauth-continue"
              onClick={handleContinue}
              disabled={loading}
            >
              {loading ? (
                <span className="btn-spinner-text">
                  <span className="oauth-inline-spinner"></span> Đang xác thực...
                </span>
              ) : (
                'Tiếp tục'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleOAuthModal;
