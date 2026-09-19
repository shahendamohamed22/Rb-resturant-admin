import { useState, useEffect } from 'react';
import {
  useMenuForAdminQuery,
  useCategoriesQuery,
  useAddCategoryMutation,
  useAddMenuItemMutation,
  useUpdateMenuItemMutation,
  useToggleMenuItemMutation,
  useDeleteMenuItemMutation,
  useUploadMenuItemImageMutation,
  useDeleteMenuItemImageMutation,
} from './useMenuQueries';

function MenuPanel() {
  const { data, isLoading, error } = useMenuForAdminQuery();
  const { data: categories } = useCategoriesQuery();
  const addCategoryMutation = useAddCategoryMutation();
  const addMutation = useAddMenuItemMutation();
  const updateMutation = useUpdateMenuItemMutation();
  const toggleMutation = useToggleMenuItemMutation();
  const deleteMutation = useDeleteMenuItemMutation();
  const uploadImageMutation = useUploadMenuItemImageMutation();
  const deleteImageMutation = useDeleteMenuItemImageMutation();

  const items = data?.items ?? [];
  const branchId = data?.branchId;

  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleAddClick = () => { setEditingItem(null); setShowModal(true); };
  const handleEditClick = (item) => { setEditingItem(item); setShowModal(true); };
  const handleToggleAvailable = (item) => toggleMutation.mutate(item.id);
  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this? This action is permanent.')) return;
    deleteMutation.mutate(id);
  };
  const handleSave = async (formData, pendingFile) => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formData });
      setShowModal(false);
    } else {

      const created = await addMutation.mutateAsync(formData);
      if (pendingFile) {
        await uploadImageMutation.mutate({ id: created.id, file: pendingFile });
      }
      setShowModal(false);
    }
  };
  const handleImageUpload = (id, file) => {
    uploadImageMutation.mutate({ id, file });
  };
  const handleImageDelete = (id) => {
    deleteImageMutation.mutate(id);
  };

  if (isLoading) return <p className="text-muted text-center py-5">Loading...</p>;
  if (error) return <p className="text-danger text-center py-5">Something went wrong.</p>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--maroon-800)', margin: 0 }}>Menu</h2>
        <div className="d-flex gap-2">
          <button
            className="btn"
            style={{ background: 'var(--blue-600)', color: '#fff', fontWeight: 800, borderRadius: 10, padding: '10px 18px' }}
            onClick={() => setShowCategoryModal(true)}
          >
            🏷️ Add Category
          </button>
          <button
            className="btn"
            style={{ background: 'var(--green-600)', color: '#fff', fontWeight: 800, borderRadius: 10, padding: '10px 18px' }}
            onClick={handleAddClick}
          >
            ➕ Add Item
          </button>
        </div>
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
                    <div style={{ position: 'relative', width: 44, height: 44 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 8, background: 'var(--cream-50)', border: '1px dashed var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {item.imageUrl ? <img src={item.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '📷'}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                        onChange={(e) => e.target.files[0] && handleImageUpload(item.id, e.target.files[0])}
                      />
                    </div>
                    {item.imageUrl && (
                      <button
                        type="button"
                        className="btn btn-sm mt-1"
                        style={{ fontSize: 10, padding: '1px 6px', background: 'var(--red-600)', color: '#fff', borderRadius: 6 }}
                        onClick={() => handleImageDelete(item.id)}
                      >
                        remove
                      </button>
                    )}
                  </td>
                  <td style={{ padding: '10px 12px', fontSize: 13 }}>{item.nameEn}</td>
                  <td style={{ padding: '10px 12px', fontSize: 13 }}>{item.categoryLabel}</td>
                  <td style={{ padding: '10px 12px', fontSize: 13 }}>{item.price} EGP</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 999, background: item.isAvailable ? '#DCF3E4' : '#F3DCDC', color: item.isAvailable ? 'var(--green-600)' : 'var(--red-600)' }}>
                      {item.isAvailable ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <div className="d-flex gap-1 flex-wrap">
                      <button className="btn btn-sm" style={{ background: 'var(--blue-600)', color: '#fff', fontSize: 12, fontWeight: 800, borderRadius: 8 }} onClick={() => handleEditClick(item)}>Edit</button>
                      <button className="btn btn-sm" style={{ background: 'var(--gold-500)', color: 'var(--maroon-950)', fontSize: 12, fontWeight: 800, borderRadius: 8 }} onClick={() => handleToggleAvailable(item)}>
                        {item.isAvailable ? 'Disable' : 'Activate'}
                      </button>
                      <button className="btn btn-sm" style={{ background: 'var(--red-600)', color: '#fff', fontSize: 12, fontWeight: 800, borderRadius: 8 }} onClick={() => handleDelete(item.id)}>Delete</button>
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
          branchId={branchId}
          categories={categories}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      {showCategoryModal && (
        <CategoryModal
          onClose={() => setShowCategoryModal(false)}
          onSave={(data) => { addCategoryMutation.mutate(data); setShowCategoryModal(false); }}
        />
      )}
    </div>
  );
}

function CategoryModal({ onClose, onSave }) {
  const [categoryKey, setCategoryKey] = useState('');
  const [labelAr, setLabelAr] = useState('');
  const [labelEn, setLabelEn] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!categoryKey || !labelAr || !labelEn) {
      setError('Please fill in all fields');
      return;
    }
    onSave({ categoryKey, labelAr, labelEn });
  };

  return (
    <div className="d-flex align-items-start justify-content-center" style={{ position: 'fixed', inset: 0, background: 'rgba(42,21,9,.55)', zIndex: 160, overflowY: 'auto', padding: '40px 16px' }} onClick={onClose}>
      <div className="bg-white p-4" style={{ borderRadius: 20, width: '100%', maxWidth: 420, boxShadow: 'var(--shadow-card)' }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--maroon-800)' }}>Add Category</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="form-label" style={{ fontSize: 12.5, fontWeight: 800 }}>Category Key (e.g. burgers)</label>
            <input className="form-control" value={categoryKey} onChange={(e) => setCategoryKey(e.target.value)} />
          </div>
          <div className="mb-2">
            <label className="form-label" style={{ fontSize: 12.5, fontWeight: 800 }}>Label (Arabic)</label>
            <input className="form-control" value={labelAr} onChange={(e) => setLabelAr(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label" style={{ fontSize: 12.5, fontWeight: 800 }}>Label (English)</label>
            <input className="form-control" value={labelEn} onChange={(e) => setLabelEn(e.target.value)} />
          </div>
          {error && <p className="text-danger" style={{ fontSize: 12 }}>{error}</p>}
          <div className="d-flex gap-2">
            <button type="button" className="btn flex-fill" style={{ background: 'var(--cream-50)', border: '1.5px solid var(--line)', color: 'var(--ink-600)', fontWeight: 800, borderRadius: 10 }} onClick={onClose}>Cancel</button>
            <button type="submit" className="btn" style={{ flex: 2, background: 'var(--maroon-800)', color: 'var(--gold-300)', fontWeight: 800, borderRadius: 10 }}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function MenuItemModal({ item, branchId, categories, onClose, onSave }) {
  const [nameAr, setNameAr] = useState(item?.nameAr || '');
  const [nameEn, setNameEn] = useState(item?.nameEn || '');
  const [descriptionAr, setDescriptionAr] = useState(item?.descriptionAr || '');
  const [descriptionEn, setDescriptionEn] = useState(item?.descriptionEn || '');
  const [categoryKey, setCategoryKey] = useState(item?.categoryKey || categories?.[0]?.categoryKey || '');
  const [price, setPrice] = useState(item?.price || '');
  const [error, setError] = useState('');

  // image handling — local preview only, real upload happens separately
  const [previewUrl, setPreviewUrl] = useState(null);
  const [pendingFile, setPendingFile] = useState(null);
  const uploadImageMutation = useUploadMenuItemImageMutation();
  const deleteImageMutation = useDeleteMenuItemImageMutation();

  const currentImageUrl = previewUrl || item?.imageUrl;

  useEffect(() => {
    // discard the object URL when the modal closes/unmounts, to avoid memory leaks
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileSelect = (file) => {
    if (!file) return;
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    if (item) {
      // editing an existing item — upload immediately
      uploadImageMutation.mutate(
        { id: item.id, file },
        {
          onSuccess: () => {
            URL.revokeObjectURL(localPreview);
            setPreviewUrl(null); // real imageUrl is now in the cache, no need for the local preview anymore
          },
        }
      );
    } else {
      // brand-new item — no id yet, hold onto the file until MenuPanel creates the item
      setPendingFile(file);
    }
  };

  const handleRemoveImage = () => {
    if (item?.imageUrl) {
      deleteImageMutation.mutate(item.id);
    }
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setPendingFile(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nameAr || !nameEn || !price || !categoryKey) {
      setError('Please fill in all required fields');
      return;
    }
    onSave({ nameAr, nameEn, descriptionAr, descriptionEn, categoryKey, price: Number(price), branchId }, pendingFile);
  };

  return (
    <div className="d-flex align-items-start justify-content-center" style={{ position: 'fixed', inset: 0, background: 'rgba(42,21,9,.55)', zIndex: 150, overflowY: 'auto', padding: '40px 16px' }} onClick={onClose}>
      <div className="bg-white p-4" style={{ borderRadius: 20, width: '100%', maxWidth: 520, boxShadow: 'var(--shadow-card)' }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--maroon-800)' }}>{item ? 'Edit Item' : 'Add New Item'}</h3>

        {(!categories || categories.length === 0) && (
          <p style={{ fontSize: 12, color: 'var(--red-600)', background: '#F3DCDC', padding: '8px 12px', borderRadius: 10, marginBottom: 12 }}>
            ⚠️ No categories yet — add one first using "Add Category".
          </p>
        )}

        <div className="mb-3 text-center">
          <div
            style={{
              width: 100, height: 100, margin: '0 auto', borderRadius: 12,
              background: 'var(--cream-50)', border: '2px dashed var(--line)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', position: 'relative',
            }}
          >
            {currentImageUrl ? (
              <img src={currentImageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: 24 }}>📷</span>
            )}
            <input
              type="file"
              accept="image/*"
              style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
              onChange={(e) => handleFileSelect(e.target.files[0])}
            />
          </div>
          {currentImageUrl && (
            <button
              type="button"
              className="btn btn-sm mt-2"
              style={{ fontSize: 11, background: 'var(--red-600)', color: '#fff', borderRadius: 8 }}
              onClick={handleRemoveImage}
            >
              Remove photo
            </button>
          )}
          {uploadImageMutation.isPending && <p style={{ fontSize: 11, color: 'var(--ink-600)' }}>Uploading...</p>}
          {!item && previewUrl && (
            <p style={{ fontSize: 11, color: 'var(--gold-500)' }}>
              Photo will upload after the item is created.
            </p>
          )}
        </div>

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

          <div className="row g-2 mb-3">
            <div className="col-6">
              <label className="form-label" style={{ fontSize: 12.5, fontWeight: 800 }}>Category</label>
              <select className="form-select" value={categoryKey} onChange={(e) => setCategoryKey(e.target.value)}>
                {(categories ?? []).map((c) => (
                  <option key={c.categoryKey} value={c.categoryKey}>{c.labelEn}</option>
                ))}
              </select>
            </div>
            <div className="col-6">
              <label className="form-label" style={{ fontSize: 12.5, fontWeight: 800 }}>Price (EGP)</label>
              <input type="number" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
          </div>

          {error && <p className="text-danger" style={{ fontSize: 12 }}>{error}</p>}

          <div className="d-flex gap-2">
            <button type="button" className="btn flex-fill" style={{ background: 'var(--cream-50)', border: '1.5px solid var(--line)', color: 'var(--ink-600)', fontWeight: 800, borderRadius: 10 }} onClick={onClose}>Cancel</button>
            <button type="submit" className="btn" style={{ flex: 2, background: 'var(--maroon-800)', color: 'var(--gold-300)', fontWeight: 800, borderRadius: 10 }}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MenuPanel;