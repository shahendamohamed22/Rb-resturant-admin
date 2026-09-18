import { useState } from 'react';
import { mockMenuItems, mockCategories } from '../../shared/api/mockData';

function MenuPanel() {
  const [items, setItems] = useState(mockMenuItems);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const catLabel = (key) => mockCategories.find((c) => c.key === key)?.labelEn || key;

  const handleAddClick = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this? This action is permanent.')) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleToggleAvailable = (id) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, isAvailable: !i.isAvailable } : i)));
  };

  const handleSave = (formData) => {
    if (editingItem) {
      setItems((prev) => prev.map((i) => (i.id === editingItem.id ? { ...i, ...formData } : i)));
    } else {
      setItems((prev) => [...prev, { ...formData, id: Math.max(0, ...prev.map((i) => i.id)) + 1, isAvailable: true }]);
    }
    setShowModal(false);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--maroon-800)', margin: 0 }}>Menu</h2>
        <button
          className="btn"
          style={{ background: 'var(--green-600)', color: '#fff', fontWeight: 800, borderRadius: 10, padding: '10px 18px' }}
          onClick={handleAddClick}
        >
          ➕ Add Item
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="w-100" style={{ borderCollapse: 'collapse', background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
          <thead>
            <tr style={{ background: 'var(--maroon-800)', color: 'var(--gold-300)' }}>
              {['Photo', 'Name', 'Category', 'Price', 'Status', 'Actions'].map((h) => (
                <th key={h} style={{ fontSize: 12, padding: '10px 12px', textAlign: 'start' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={6}><div className="text-center py-5 text-muted">No data to display here.</div></td></tr>
            ) : (
              items.map((item, i) => (
                <tr key={item.id} style={{ background: i % 2 === 1 ? '#FBF6EA' : '#fff' }}>
                  <td style={{ padding: '10px 12px' }}>
                    <div
                      style={{
                        width: 44, height: 44, borderRadius: 8, background: 'var(--cream-50)',
                        border: '1px dashed var(--line)', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', overflow: 'hidden',
                      }}
                    >
                      {item.imageUrl ? <img src={item.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '📷'}
                    </div>
                  </td>
                  <td style={{ padding: '10px 12px', fontSize: 13 }}>{item.nameEn}</td>
                  <td style={{ padding: '10px 12px', fontSize: 13 }}>{catLabel(item.categoryKey)}</td>
                  <td style={{ padding: '10px 12px', fontSize: 13 }}>{item.price} EGP</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span
                      style={{
                        fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 999,
                        background: item.isAvailable ? '#DCF3E4' : '#F3DCDC',
                        color: item.isAvailable ? 'var(--green-600)' : 'var(--red-600)',
                      }}
                    >
                      {item.isAvailable ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <div className="d-flex gap-1 flex-wrap">
                      <button
                        className="btn btn-sm"
                        style={{ background: 'var(--blue-600)', color: '#fff', fontSize: 12, fontWeight: 800, borderRadius: 8 }}
                        onClick={() => handleEditClick(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm"
                        style={{ background: 'var(--gold-500)', color: 'var(--maroon-950)', fontSize: 12, fontWeight: 800, borderRadius: 8 }}
                        onClick={() => handleToggleAvailable(item.id)}
                      >
                        {item.isAvailable ? 'Disable' : 'Activate'}
                      </button>
                      <button
                        className="btn btn-sm"
                        style={{ background: 'var(--red-600)', color: '#fff', fontSize: 12, fontWeight: 800, borderRadius: 8 }}
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <MenuItemModal
          item={editingItem}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function MenuItemModal({ item, onClose, onSave }) {
  const [nameAr, setNameAr] = useState(item?.nameAr || '');
  const [nameEn, setNameEn] = useState(item?.nameEn || '');
  const [descriptionAr, setDescriptionAr] = useState(item?.descriptionAr || '');
  const [descriptionEn, setDescriptionEn] = useState(item?.descriptionEn || '');
  const [categoryKey, setCategoryKey] = useState(item?.categoryKey || mockCategories[0].key);
  const [price, setPrice] = useState(item?.price || '');
  const [imageUrl, setImageUrl] = useState(item?.imageUrl || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nameAr || !nameEn || !price) {
      setError('Please fill in all required fields');
      return;
    }
    onSave({ nameAr, nameEn, descriptionAr, descriptionEn, categoryKey, price: Number(price), imageUrl: imageUrl || null });
  };

  return (
    <div
      className="d-flex align-items-start justify-content-center"
      style={{ position: 'fixed', inset: 0, background: 'rgba(42,21,9,.55)', zIndex: 150, overflowY: 'auto', padding: '40px 16px' }}
      onClick={onClose}
    >
      <div className="bg-white p-4" style={{ borderRadius: 20, width: '100%', maxWidth: 520, boxShadow: 'var(--shadow-card)' }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--maroon-800)' }}>
          {item ? 'Edit Item' : 'Add New Item'}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="row g-2 mb-2">
            <div className="col-6">
              <label className="form-label" style={{ fontSize: 12.5, fontWeight: 800 }}>Name (Arabic)</label>
              <input className="form-control" value={nameAr} onChange={(e) => setNameAr(e.target.value)} />
            </div>
            <div className="col-6">
              <label className="form-label" style={{ fontSize: 12.5, fontWeight: 800 }}>Name (English)</label>
              <input className="form-control" value={nameEn} onChange={(e) => setNameEn(e.target.value)} />
            </div>
          </div>

          <div className="row g-2 mb-2">
            <div className="col-6">
              <label className="form-label" style={{ fontSize: 12.5, fontWeight: 800 }}>Description (Arabic)</label>
              <textarea className="form-control" value={descriptionAr} onChange={(e) => setDescriptionAr(e.target.value)} />
            </div>
            <div className="col-6">
              <label className="form-label" style={{ fontSize: 12.5, fontWeight: 800 }}>Description (English)</label>
              <textarea className="form-control" value={descriptionEn} onChange={(e) => setDescriptionEn(e.target.value)} />
            </div>
          </div>

          <div className="row g-2 mb-2">
            <div className="col-6">
              <label className="form-label" style={{ fontSize: 12.5, fontWeight: 800 }}>Category</label>
              <select className="form-select" value={categoryKey} onChange={(e) => setCategoryKey(e.target.value)}>
                {mockCategories.map((c) => (
                  <option key={c.key} value={c.key}>{c.labelEn}</option>
                ))}
              </select>
            </div>
            <div className="col-6">
              <label className="form-label" style={{ fontSize: 12.5, fontWeight: 800 }}>Price (EGP)</label>
              <input type="number" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ fontSize: 12.5, fontWeight: 800 }}>Image URL (optional)</label>
            <input className="form-control" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
          </div>

          {error && <p className="text-danger" style={{ fontSize: 12 }}>{error}</p>}

          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn flex-fill"
              style={{ background: 'var(--cream-50)', border: '1.5px solid var(--line)', color: 'var(--ink-600)', fontWeight: 800, borderRadius: 10 }}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn"
              style={{ flex: 2, background: 'var(--maroon-800)', color: 'var(--gold-300)', fontWeight: 800, borderRadius: 10 }}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MenuPanel;