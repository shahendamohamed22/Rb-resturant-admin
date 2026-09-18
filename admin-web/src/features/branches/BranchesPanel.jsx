import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import api from '../../shared/api/axiosClient';
import { ENDPOINTS } from '../../shared/api/endpoints';
import { useBranchesQuery } from './useBranchesQuery';

function BranchesPanel() {
    const queryClient = useQueryClient();
    const { data: branches = [], isLoading, error } = useBranchesQuery();
    const [showModal, setShowModal] = useState(false);
    const [editingBranch, setEditingBranch] = useState(null);
    const [actionError, setActionError] = useState('');

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin', 'branches'] });

    const createMutation = useMutation({
        mutationFn: (payload) => api.post(ENDPOINTS.createBranch, payload),
        onSuccess: () => { invalidate(); setShowModal(false); },
        onError: (err) => setActionError(err.response?.data?.title || 'Failed to create branch'),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }) => api.put(ENDPOINTS.branchById(id), payload),
        onSuccess: () => { invalidate(); setShowModal(false); },
        onError: (err) => setActionError(err.response?.data?.title || 'Failed to update branch'),
    });

    const toggleMutation = useMutation({
        mutationFn: (id) => api.patch(ENDPOINTS.branchToggleStatus(id)),
        onSuccess: invalidate,
        onError: (err) => setActionError(err.response?.data?.title || 'Failed to update status'),
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(ENDPOINTS.branchById(id)),
        onSuccess: invalidate,
        onError: (err) => setActionError(err.response?.data?.title || 'Failed to delete branch'),
    });

    const handleAddClick = () => {
        setActionError('');
        setEditingBranch(null);
        setShowModal(true);
    };

    const handleEditClick = (branch) => {
        setActionError('');
        setEditingBranch(branch);
        setShowModal(true);
    };

    const handleToggleActive = (id) => toggleMutation.mutate(id);

    const handleDelete = (id) => {
        if (!window.confirm('Are you sure you want to delete this? This action is permanent.')) return;
        deleteMutation.mutate(id);
    };

    const handleSave = (formData) => {
        if (editingBranch) {
            // UpdateBranchCommand doesn't accept nameAr/nameEn — names are immutable after creation.
            const { nameAr, nameEn, ...updatable } = formData;
            updateMutation.mutate({ id: editingBranch.id, payload: { id: editingBranch.id, ...updatable } });
        } else {
            createMutation.mutate(formData);
        }
    };

    if (isLoading) return <div className="text-center py-5 text-muted">Loading branches...</div>;
    if (error) return <div className="text-center py-5 text-danger">Failed to load branches.</div>;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--maroon-800)', margin: 0 }}>Branches</h2>
                <button
                    className="btn"
                    style={{ background: 'var(--green-600)', color: '#fff', fontWeight: 800, borderRadius: 10, padding: '10px 18px' }}
                    onClick={handleAddClick}
                >
                    ➕ Add Branch
                </button>
            </div>

            {actionError && <p className="text-danger mb-2" style={{ fontSize: 13 }}>{actionError}</p>}

            <div style={{ overflowX: 'auto' }}>
                <table className="w-100" style={{ borderCollapse: 'collapse', background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
                    <thead>
                        <tr style={{ background: 'var(--maroon-800)', color: 'var(--gold-300)' }}>
                            {['Branch', 'Delivery Fee', 'ETA', 'Status', 'Actions'].map((h) => (
                                <th key={h} style={{ fontSize: 12, padding: '10px 12px', textAlign: 'start' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {branches.length === 0 ? (
                            <tr><td colSpan={5}><div className="text-center py-5 text-muted">No data to display here.</div></td></tr>
                        ) : (
                            branches.map((branch, i) => (
                                <tr key={branch.id} style={{ background: i % 2 === 1 ? '#FBF6EA' : '#fff' }}>
                                    <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 700 }}>{branch.nameEn}</td>
                                    <td style={{ padding: '10px 12px', fontSize: 13 }}>{branch.deliveryFee} EGP</td>
                                    <td style={{ padding: '10px 12px', fontSize: 13 }}>{branch.etaMinMinutes}–{branch.etaMaxMinutes} min</td>
                                    <td style={{ padding: '10px 12px' }}>
                                        <span
                                            style={{
                                                fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 999,
                                                background: branch.isActive ? '#DCF3E4' : '#F3DCDC',
                                                color: branch.isActive ? 'var(--green-600)' : 'var(--red-600)',
                                            }}
                                        >
                                            {branch.isActive ? 'Active' : 'Disabled'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '10px 12px' }}>
                                        <div className="d-flex gap-1 flex-wrap">
                                            <button
                                                className="btn btn-sm"
                                                style={{ background: 'var(--blue-600)', color: '#fff', fontSize: 12, fontWeight: 800, borderRadius: 8 }}
                                                onClick={() => handleEditClick(branch)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-sm"
                                                style={{ background: 'var(--gold-500)', color: 'var(--maroon-950)', fontSize: 12, fontWeight: 800, borderRadius: 8 }}
                                                disabled={toggleMutation.isPending}
                                                onClick={() => handleToggleActive(branch.id)}
                                            >
                                                {branch.isActive ? 'Disable' : 'Activate'}
                                            </button>
                                            <button
                                                className="btn btn-sm"
                                                style={{ background: 'var(--red-600)', color: '#fff', fontSize: 12, fontWeight: 800, borderRadius: 8 }}
                                                disabled={deleteMutation.isPending}
                                                onClick={() => handleDelete(branch.id)}
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
                <BranchModal
                    branch={editingBranch}
                    saving={createMutation.isPending || updateMutation.isPending}
                    onClose={() => setShowModal(false)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}

function BranchModal({ branch, saving, onClose, onSave }) {
    const [nameAr, setNameAr] = useState(branch?.nameAr || '');
    const [nameEn, setNameEn] = useState(branch?.nameEn || '');
    const [deliveryFee, setDeliveryFee] = useState(branch?.deliveryFee || '');
    const [etaMinMinutes, setEtaMinMinutes] = useState(branch?.etaMinMinutes || '');
    const [etaMaxMinutes, setEtaMaxMinutes] = useState(branch?.etaMaxMinutes || '');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!nameAr || !nameEn || !deliveryFee) {
            setError('Please fill in all required fields');
            return;
        }
        onSave({
            nameAr, nameEn,
            deliveryFee: Number(deliveryFee),
            etaMinMinutes: Number(etaMinMinutes),
            etaMaxMinutes: Number(etaMaxMinutes),
        });
    };

    return (
        <div
            className="d-flex align-items-start justify-content-center"
            style={{ position: 'fixed', inset: 0, background: 'rgba(42,21,9,.55)', zIndex: 150, overflowY: 'auto', padding: '40px 16px' }}
            onClick={onClose}
        >
            <div className="bg-white p-4" style={{ borderRadius: 20, width: '100%', maxWidth: 480, boxShadow: 'var(--shadow-card)' }} onClick={(e) => e.stopPropagation()}>
                <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--maroon-800)' }}>
                    {branch ? 'Edit Branch' : 'Add New Branch'}
                </h3>

                <form onSubmit={handleSubmit}>
                    <div className="row g-2 mb-2">
                        <div className="col-6">
                            <label className="form-label" style={{ fontSize: 12.5, fontWeight: 800 }}>Branch name (Arabic)</label>
                            <input className="form-control" value={nameAr} disabled={!!branch} onChange={(e) => setNameAr(e.target.value)} />
                        </div>
                        <div className="col-6">
                            <label className="form-label" style={{ fontSize: 12.5, fontWeight: 800 }}>Branch name (English)</label>
                            <input className="form-control" value={nameEn} disabled={!!branch} onChange={(e) => setNameEn(e.target.value)} />
                        </div>
                    </div>
                    {branch && <p className="text-muted" style={{ fontSize: 11.5, marginTop: -4 }}>Branch names can't be changed after creation.</p>}

                    <div className="mb-2">
                        <label className="form-label" style={{ fontSize: 12.5, fontWeight: 800 }}>Delivery fee (EGP)</label>
                        <input type="number" className="form-control" value={deliveryFee} onChange={(e) => setDeliveryFee(e.target.value)} />
                    </div>

                    <div className="row g-2 mb-3">
                        <div className="col-6">
                            <label className="form-label" style={{ fontSize: 12.5, fontWeight: 800 }}>Min time (min)</label>
                            <input type="number" className="form-control" value={etaMinMinutes} onChange={(e) => setEtaMinMinutes(e.target.value)} />
                        </div>
                        <div className="col-6">
                            <label className="form-label" style={{ fontSize: 12.5, fontWeight: 800 }}>Max time (min)</label>
                            <input type="number" className="form-control" value={etaMaxMinutes} onChange={(e) => setEtaMaxMinutes(e.target.value)} />
                        </div>
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
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default BranchesPanel;