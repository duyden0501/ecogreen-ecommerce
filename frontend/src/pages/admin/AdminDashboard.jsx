import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  getAllProductsForAdmin, createProduct, updateProduct, deleteProduct,
} from '../../services/productApi';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../../services/categoryApi';
import { getAllOrders, updateOrderStatus } from '../../services/orderApi';
import { getAllUsers, deleteUser } from '../../services/userApi';
import { getAllReturns, updateReturnStatus } from '../../services/returnApi';
import AdminStats from '../../components/AdminStats';
import { resolveProductImage } from '../../utils/imageResolver';

const emptyProduct = { name: '', price: '', image: '', description: '', stockQuantity: 0, categoryId: '', status: 'ACTIVE' };
const emptyCategory = { name: '', description: '' };

const STATUS_MAP = {
  PENDING: { label: 'Chờ thanh toán', color: '#856404', bg: '#fff3cd' },
  CONFIRMED: { label: 'Đã xác nhận', color: '#004085', bg: '#cce5ff' },
  PAID: { label: 'Đã thanh toán', color: '#155724', bg: '#d4edda' },
  CANCELLED: { label: 'Đã hủy', color: '#721c24', bg: '#f8d7da' },
};

/**
 * Admin CMS - Quản lý sản phẩm, danh mục, đơn hàng, người dùng, đổi trả hàng.
 */
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products'); // products | categories | orders | returns | users
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [returns, setReturns] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(emptyProduct);
  const [isEditProduct, setIsEditProduct] = useState(false);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(emptyCategory);
  const [isEditCategory, setIsEditCategory] = useState(false);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      if (activeTab === 'products') {
        const [p, c] = await Promise.all([getAllProductsForAdmin(), getAllCategories()]);
        setProducts(p);
        setCategories(c);
      } else if (activeTab === 'categories') {
        setCategories(await getAllCategories());
      } else if (activeTab === 'orders') {
        setOrders(await getAllOrders());
      } else if (activeTab === 'users') {
        setUsers(await getAllUsers());
      } else if (activeTab === 'returns') {
        setReturns(await getAllReturns());
      }
    } catch (error) {
      setErrorMsg(error.friendlyMessage || 'Không thể tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  // --- Products ---
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn ngừng kinh doanh sản phẩm này?')) return;
    try { await deleteProduct(id); loadData(); } catch (e) { alert(e.friendlyMessage || 'Thao tác thất bại.'); }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: currentProduct.name,
        price: Number(currentProduct.price),
        stockQuantity: Number(currentProduct.stockQuantity),
        image: currentProduct.image,
        description: currentProduct.description,
        categoryId: Number(currentProduct.categoryId),
        status: currentProduct.status,
      };
      if (isEditProduct) await updateProduct(currentProduct.id, payload);
      else await createProduct(payload);
      setIsProductModalOpen(false);
      loadData();
    } catch (err) {
      alert(err.friendlyMessage || 'Không thể lưu thông tin sản phẩm.');
    }
  };

  // --- Categories ---
  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa danh mục này? Các sản phẩm thuộc danh mục sẽ bị ảnh hưởng.')) return;
    try { await deleteCategory(id); loadData(); } catch (e) { alert(e.friendlyMessage || 'Thao tác thất bại.'); }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditCategory) await updateCategory(currentCategory.id, currentCategory);
      else await createCategory(currentCategory);
      setIsCategoryModalOpen(false);
      loadData();
    } catch (err) {
      alert(err.friendlyMessage || 'Không thể lưu thông tin danh mục.');
    }
  };

  // --- Orders ---
  const handleUpdateStatus = async (orderId, newStatus) => {
    try { await updateOrderStatus(orderId, newStatus); loadData(); }
    catch (e) { alert(e.friendlyMessage || 'Không thể cập nhật trạng thái đơn hàng.'); }
  };

  // --- Returns ---
  const handleUpdateReturnStatus = async (id, status) => {
    const defaultNote = status === 'APPROVED' ? 'EcoGreen đã chấp thuận yêu cầu đổi trả. Vui lòng đóng gói sản phẩm gửi về địa chỉ shop.' : 'Yêu cầu không đáp ứng điều kiện đổi trả trong 7 ngày.';
    const adminNote = prompt(`Nhập ghi chú phản hồi khách hàng:`, defaultNote);
    if (adminNote === null) return;
    try {
      await updateReturnStatus(id, status, adminNote);
      loadData();
    } catch (e) {
      alert(e.friendlyMessage || 'Không thể cập nhật trạng thái đổi/trả.');
    }
  };

  // --- Users ---
  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa tài khoản "${name}"?`)) return;
    try { await deleteUser(id); loadData(); } catch (e) { alert(e.friendlyMessage || 'Thao tác thất bại.'); }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const tabLabel = {
    products: '📦 Quản lý Sản phẩm',
    categories: '🏷️ Quản lý Danh mục',
    orders: '📜 Quản lý Đơn hàng',
    returns: '♻️ Quản lý Đổi / Trả hàng (Chính sách 7 ngày)',
    users: '👥 Quản lý Người dùng & Phân quyền',
  }[activeTab];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      {/* SIDEBAR */}
      <div style={{ width: '270px', backgroundColor: '#1b3a1f', color: '#fff', padding: '20px 0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '0 20px 20px', borderBottom: '1px solid #2e5233', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>🌿 EcoGreen Admin</h2>
          <small style={{ color: '#a7f3d0' }}>Hệ thống quản trị bán hàng</small>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {['products', 'categories', 'orders', 'returns', 'users'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '15px 20px', textAlign: 'left',
                backgroundColor: activeTab === tab ? '#2e5233' : 'transparent',
                color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.95rem',
                borderLeft: activeTab === tab ? '4px solid #66bb6a' : '4px solid transparent',
                fontWeight: activeTab === tab ? 'bold' : 'normal',
              }}
            >
              {tab === 'products' && '📦 Quản lý Sản phẩm'}
              {tab === 'categories' && '🏷️ Quản lý Danh mục'}
              {tab === 'orders' && '📜 Quản lý Đơn hàng'}
              {tab === 'returns' && '♻️ Đổi / Trả hàng'}
              {tab === 'users' && '👥 Quản lý Người dùng'}
            </button>
          ))}
        </div>
        <div style={{ marginTop: 'auto', padding: '20px', borderTop: '1px solid #2e5233', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.2rem' }}>👤</span>
          <span style={{ fontSize: '0.9rem', color: '#c8e6c9' }}>{user?.username} (Quản trị viên)</span>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: '70px', backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 30px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: 0, color: '#1b3a1f' }}>{tabLabel}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button onClick={() => navigate('/')} style={{ padding: '8px 16px', backgroundColor: '#2e7d32', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>🏠 Xem cửa hàng</button>
            <button onClick={handleLogout} style={{ padding: '8px 16px', color: '#c62828', border: '1px solid #c62828', borderRadius: '5px', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: 'bold' }}>Đăng xuất</button>
          </div>
        </div>

        <div style={{ padding: '30px', overflowY: 'auto' }}>
          <AdminStats />

          {errorMsg && <p style={{ color: '#c62828', backgroundColor: '#fde8e8', padding: '10px 14px', borderRadius: '6px' }}>{errorMsg}</p>}

          {loading ? (
            <div style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>Đang tải dữ liệu...</div>
          ) : (
            <>
              {/* TAB 1: SẢN PHẨM */}
              {activeTab === 'products' && (
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <input
                      type="text" placeholder="Tìm kiếm sản phẩm theo tên..." value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ padding: '10px 14px', width: '320px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                    <button
                      onClick={() => { setIsEditProduct(false); setCurrentProduct(emptyProduct); setIsProductModalOpen(true); }}
                      style={{ padding: '10px 20px', backgroundColor: '#2e7d32', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      + Thêm sản phẩm mới
                    </button>
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left', borderBottom: '2px solid #eee' }}>
                        <th style={{ padding: '12px' }}>Hình ảnh</th>
                        <th style={{ padding: '12px' }}>Tên sản phẩm</th>
                        <th style={{ padding: '12px' }}>Danh mục</th>
                        <th style={{ padding: '12px' }}>Giá bán</th>
                        <th style={{ padding: '12px' }}>Tồn kho</th>
                        <th style={{ padding: '12px' }}>Trạng thái</th>
                        <th style={{ padding: '12px', textAlign: 'center' }}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
                        <tr key={p.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                          <td style={{ padding: '12px' }}>
                            <img src={resolveProductImage(p.image)} alt="" style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '6px' }} />
                          </td>
                          <td style={{ padding: '12px', fontWeight: '500' }}>{p.name}</td>
                          <td style={{ padding: '12px' }}>{p.categoryName}</td>
                          <td style={{ padding: '12px', color: '#2e7d32', fontWeight: 600 }}>{Number(p.price).toLocaleString('vi-VN')} ₫</td>
                          <td style={{ padding: '12px' }}>
                            <span style={{
                              padding: '4px 10px', borderRadius: '4px',
                              backgroundColor: p.stockQuantity > 10 ? '#d4edda' : p.stockQuantity > 0 ? '#fff3cd' : '#f8d7da',
                              color: p.stockQuantity > 10 ? '#155724' : p.stockQuantity > 0 ? '#856404' : '#721c24',
                              fontWeight: 'bold', fontSize: '0.85rem'
                            }}>
                              {p.stockQuantity}
                            </span>
                          </td>
                          <td style={{ padding: '12px' }}>
                            <span style={{
                              padding: '3px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600,
                              backgroundColor: p.status === 'ACTIVE' ? '#e8f5e9' : '#f5f5f5',
                              color: p.status === 'ACTIVE' ? '#2e7d32' : '#757575'
                            }}>
                              {p.status === 'ACTIVE' ? 'Đang kinh doanh' : 'Ngừng bán'}
                            </span>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <button onClick={() => {
                              setIsEditProduct(true);
                              setCurrentProduct({ ...p, categoryId: p.categoryId });
                              setIsProductModalOpen(true);
                            }} style={{ marginRight: '10px', color: '#1976d2', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600 }}>Sửa</button>
                            <button onClick={() => handleDeleteProduct(p.id)} style={{ color: '#c62828', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600 }}>Ngừng bán</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {products.length === 0 && <p style={{ padding: '30px', textAlign: 'center', color: '#888' }}>Chưa có sản phẩm nào. Hãy bấm thêm sản phẩm mới ở trên.</p>}
                </div>
              )}

              {/* TAB 2: DANH MỤC */}
              {activeTab === 'categories' && (
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                    <button
                      onClick={() => { setIsEditCategory(false); setCurrentCategory(emptyCategory); setIsCategoryModalOpen(true); }}
                      style={{ padding: '10px 20px', backgroundColor: '#2e7d32', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      + Thêm danh mục mới
                    </button>
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left', borderBottom: '2px solid #eee' }}>
                        <th style={{ padding: '12px' }}>Tên danh mục</th>
                        <th style={{ padding: '12px' }}>Mô tả</th>
                        <th style={{ padding: '12px', textAlign: 'center' }}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map(c => (
                        <tr key={c.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                          <td style={{ padding: '12px', fontWeight: '500' }}>{c.name}</td>
                          <td style={{ padding: '12px', color: '#666' }}>{c.description}</td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <button onClick={() => { setIsEditCategory(true); setCurrentCategory(c); setIsCategoryModalOpen(true); }} style={{ marginRight: '10px', color: '#1976d2', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600 }}>Sửa</button>
                            <button onClick={() => handleDeleteCategory(c.id)} style={{ color: '#c62828', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600 }}>Xóa</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {categories.length === 0 && <p style={{ padding: '30px', textAlign: 'center', color: '#888' }}>Chưa có danh mục nào. Hãy bấm thêm danh mục mới ở trên.</p>}
                </div>
              )}

              {/* TAB 3: ĐƠN HÀNG */}
              {activeTab === 'orders' && (
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left', borderBottom: '2px solid #eee' }}>
                        <th style={{ padding: '12px' }}>Mã ĐH</th>
                        <th style={{ padding: '12px' }}>Khách hàng</th>
                        <th style={{ padding: '12px' }}>Ngày đặt</th>
                        <th style={{ padding: '12px' }}>Tổng tiền</th>
                        <th style={{ padding: '12px' }}>Trạng thái</th>
                        <th style={{ padding: '12px', textAlign: 'center' }}>Cập nhật trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(o => {
                        const sInfo = STATUS_MAP[o.status] || { label: o.status, color: '#333', bg: '#f1f5f9' };
                        return (
                          <tr key={o.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                            <td style={{ padding: '12px', fontWeight: 'bold' }}>#{o.id}</td>
                            <td style={{ padding: '12px' }}>{o.customerName}</td>
                            <td style={{ padding: '12px' }}>{new Date(o.createdAt).toLocaleString('vi-VN')}</td>
                            <td style={{ padding: '12px', color: '#2e7d32', fontWeight: 'bold' }}>{Number(o.totalPrice).toLocaleString('vi-VN')} ₫</td>
                            <td style={{ padding: '12px' }}>
                              <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.82rem', fontWeight: 600, backgroundColor: sInfo.bg, color: sInfo.color }}>
                                {sInfo.label}
                              </span>
                            </td>
                            <td style={{ padding: '12px', textAlign: 'center' }}>
                              <select
                                value={o.status}
                                onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                                style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                              >
                                <option value="PENDING">Chờ thanh toán (PENDING)</option>
                                <option value="CONFIRMED">Đã xác nhận (CONFIRMED)</option>
                                <option value="PAID">Đã thanh toán (PAID)</option>
                                <option value="CANCELLED">Đã hủy (CANCELLED)</option>
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {orders.length === 0 && <p style={{ padding: '30px', textAlign: 'center', color: '#888' }}>Chưa có đơn hàng nào.</p>}
                </div>
              )}

              {/* TAB 4: NGƯỜI DÙNG */}
              {activeTab === 'users' && (
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left', borderBottom: '2px solid #eee' }}>
                        <th style={{ padding: '12px' }}>Mã ND</th>
                        <th style={{ padding: '12px' }}>Tên tài khoản</th>
                        <th style={{ padding: '12px' }}>Email</th>
                        <th style={{ padding: '12px' }}>Quyền / Vai trò</th>
                        <th style={{ padding: '12px', textAlign: 'center' }}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                          <td style={{ padding: '12px' }}>#{u.id}</td>
                          <td style={{ padding: '12px', fontWeight: '500' }}>{u.username}</td>
                          <td style={{ padding: '12px' }}>{u.email}</td>
                          <td style={{ padding: '12px' }}>
                            {u.roles.map(r => (
                              <span key={r} style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.82rem', backgroundColor: r === 'ADMIN' ? '#c62828' : '#1976d2', color: '#fff', marginRight: '4px', fontWeight: 600 }}>
                                {r === 'ADMIN' ? 'Quản trị viên' : 'Khách hàng'}
                              </span>
                            ))}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            {!u.roles.includes('ADMIN') && (
                              <button onClick={() => handleDeleteUser(u.id, u.username)} style={{ color: '#c62828', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600 }}>Xóa</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {users.length === 0 && <p style={{ padding: '30px', textAlign: 'center', color: '#888' }}>Chưa có người dùng nào.</p>}
                </div>
              )}

              {/* TAB 5: ĐỔI TRẢ HÀNG */}
              {activeTab === 'returns' && (
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <h4 style={{ margin: 0, color: '#1b3a1f', fontSize: '1.1rem' }}>Danh sách yêu cầu Đổi / Trả hàng</h4>
                    <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#666' }}>
                      Xem xét và phê duyệt hoặc từ chối các yêu cầu đổi trả theo chính sách 7 ngày của EcoGreen.
                    </p>
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left', borderBottom: '2px solid #eee' }}>
                        <th style={{ padding: '12px' }}>Mã YC</th>
                        <th style={{ padding: '12px' }}>Đơn hàng</th>
                        <th style={{ padding: '12px' }}>Khách hàng</th>
                        <th style={{ padding: '12px' }}>Lý do</th>
                        <th style={{ padding: '12px' }}>Mô tả</th>
                        <th style={{ padding: '12px' }}>Trạng thái</th>
                        <th style={{ padding: '12px' }}>Ghi chú Admin</th>
                        <th style={{ padding: '12px', textAlign: 'center' }}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {returns.map((r) => (
                        <tr key={r.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                          <td style={{ padding: '12px' }}>#{r.id}</td>
                          <td style={{ padding: '12px', fontWeight: 'bold' }}>#{r.orderId}</td>
                          <td style={{ padding: '12px' }}>{r.username}</td>
                          <td style={{ padding: '12px', color: '#e65100', fontWeight: '500' }}>{r.reason}</td>
                          <td style={{ padding: '12px', maxWidth: '220px', fontSize: '0.88rem' }}>{r.description || '—'}</td>
                          <td style={{ padding: '12px' }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '4px 10px',
                              borderRadius: '12px',
                              fontSize: '0.75rem',
                              fontWeight: 'bold',
                              backgroundColor: r.status === 'APPROVED' ? '#e8f5e9' : r.status === 'REJECTED' ? '#ffebee' : '#fff8e1',
                              color: r.status === 'APPROVED' ? '#2e7d32' : r.status === 'REJECTED' ? '#c62828' : '#f57f17'
                            }}>
                              {r.status === 'APPROVED' ? 'Đã duyệt' : r.status === 'REJECTED' ? 'Từ chối' : 'Chờ xử lý'}
                            </span>
                          </td>
                          <td style={{ padding: '12px', fontSize: '0.88rem', color: '#555' }}>{r.adminNote || '—'}</td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            {r.status === 'PENDING' ? (
                              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                <button
                                  onClick={() => handleUpdateReturnStatus(r.id, 'APPROVED')}
                                  style={{ padding: '6px 12px', backgroundColor: '#2e7d32', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }}
                                >
                                  Duyệt
                                </button>
                                <button
                                  onClick={() => handleUpdateReturnStatus(r.id, 'REJECTED')}
                                  style={{ padding: '6px 12px', backgroundColor: '#c62828', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }}
                                >
                                  Từ chối
                                </button>
                              </div>
                            ) : (
                              <span style={{ color: '#888', fontSize: '0.85rem' }}>Đã giải quyết</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {returns.length === 0 && <p style={{ padding: '24px', textAlign: 'center', color: '#888' }}>Chưa có yêu cầu đổi/trả hàng nào.</p>}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* PRODUCT MODAL */}
      {isProductModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', width: '520px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}>
            <h3 style={{ color: '#1b3a1f', marginTop: 0 }}>{isEditProduct ? '✏️ Chỉnh sửa sản phẩm' : '➕ Thêm sản phẩm mới'}</h3>
            <form onSubmit={handleProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '5px' }}>Tên sản phẩm *</label>
                <input type="text" placeholder="Ví dụ: Balo Vải Đay Tự Nhiên" value={currentProduct.name} onChange={e => setCurrentProduct({ ...currentProduct, name: e.target.value })} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '5px' }}>Danh mục sản phẩm *</label>
                <select value={currentProduct.categoryId} onChange={e => setCurrentProduct({ ...currentProduct, categoryId: e.target.value })} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '5px' }}>Giá bán (₫) *</label>
                  <input type="number" step="1000" placeholder="150000" value={currentProduct.price} onChange={e => setCurrentProduct({ ...currentProduct, price: e.target.value })} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '5px' }}>Tồn kho *</label>
                  <input type="number" placeholder="50" value={currentProduct.stockQuantity} onChange={e => setCurrentProduct({ ...currentProduct, stockQuantity: parseInt(e.target.value) || 0 })} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '5px' }}>Hình ảnh (URL hoặc tên file trong assets/products)</label>
                <input type="text" placeholder="https://... hoặc ten-anh.jpg" value={currentProduct.image || ''} onChange={e => setCurrentProduct({ ...currentProduct, image: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '5px' }}>Mô tả sản phẩm</label>
                <textarea placeholder="Mô tả chất liệu tái chế, nguồn gốc xuất xứ, đặc tính sinh thái..." rows={3} value={currentProduct.description || ''} onChange={e => setCurrentProduct({ ...currentProduct, description: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontFamily: 'inherit' }} />
              </div>

              {isEditProduct && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '5px' }}>Trạng thái kinh doanh</label>
                  <select value={currentProduct.status} onChange={e => setCurrentProduct({ ...currentProduct, status: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                    <option value="ACTIVE">Đang kinh doanh (ACTIVE)</option>
                    <option value="INACTIVE">Ngừng kinh doanh (INACTIVE)</option>
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsProductModalOpen(false)} style={{ padding: '10px 18px', border: '1px solid #cbd5e1', background: 'transparent', borderRadius: '6px', cursor: 'pointer' }}>Hủy</button>
                <button type="submit" style={{ backgroundColor: '#2e7d32', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Lưu sản phẩm</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {isCategoryModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', width: '460px', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}>
            <h3 style={{ color: '#1b3a1f', marginTop: 0 }}>{isEditCategory ? '✏️ Chỉnh sửa danh mục' : '➕ Thêm danh mục mới'}</h3>
            <form onSubmit={handleCategorySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '5px' }}>Tên danh mục *</label>
                <input type="text" placeholder="Ví dụ: Thời Trang & Phụ Kiện Xanh" value={currentCategory.name} onChange={e => setCurrentCategory({ ...currentCategory, name: e.target.value })} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '5px' }}>Mô tả danh mục</label>
                <textarea placeholder="Mô tả về nhóm sản phẩm sinh thái trong danh mục này..." rows={3} value={currentCategory.description || ''} onChange={e => setCurrentCategory({ ...currentCategory, description: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontFamily: 'inherit' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsCategoryModalOpen(false)} style={{ padding: '10px 18px', border: '1px solid #cbd5e1', background: 'transparent', borderRadius: '6px', cursor: 'pointer' }}>Hủy</button>
                <button type="submit" style={{ backgroundColor: '#2e7d32', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Lưu danh mục</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
