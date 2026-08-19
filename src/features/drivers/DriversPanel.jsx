import { useState } from 'react';
import { mockDrivers, mockBranches } from '../../shared/api/mockData';

const VEHICLE_LABELS = { bike: 'Motorbike', bicycle: 'Bicycle', car: 'Car' };

function DriversPanel() {
  const [drivers, setDrivers] = useState(mockDrivers);
  const [showModal, setShowModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);

  const branchName = (id) => mockBranches.find((b) => b.id === id)?.nameEn || id;

  const handleAddClick = () => {
    setEditingDriver(null);
    setShowModal(true);
  };

  const handleEditClick = (driver) => {
    setEditingDriver(driver);
    setShowModal(true);
  };

  const handleToggleActive = (driverId) => {
    setDrivers((prev) => prev.map((d) => (d.driverId === driverId ? { ...d, isActive: !d.isActive } : d)));
  };

  const handleDelete = (driverId) => {
    if (!window.confirm('Are you sure you want to delete this? This action is permanent.')) return;
    setDrivers((prev) => prev.filter((d) => d.driverId !== driverId));
  };

  const handleSave = (formData) => {
    // §6.3: reject duplicate phone across drivers (except the one being edited)
    const clash = drivers.find((d) => d.phone === formData.phone && d.driverId !== editingDriver?.driverId);
    if (clash) {
      return 'This number is already registered to another driver';
    }

    if (editingDriver) {
      setDrivers((prev) => prev.map((d) => (d.driverId === editingDriver.driverId ? { ...d, ...formData } : d)));
    } else {
      setDrivers((prev) => [
        ...prev,
        { ...formData, driverId: `d${Date.now()}`, isActive: true, deliveriesCompleted: 0 },
      ]);
    }
    setShowModal(false);
    return null;
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--maroon-800)', margin: 0 }}>Drivers</h2>
        <button
          className="btn"
          style={{ background: 'var(--green-600)', color: '#fff', fontWeight: 800, borderRadius: 10, padding: '10px 18px' }}
          onClick={handleAddClick}
        >
          ➕ Add Driver
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="w-100" style={{ borderCollapse: 'collapse', background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
          <thead>
            <tr style={{ background: 'var(--maroon-800)', color: 'var(--gold-300)' }}>
              {['Driver', 'Phone', 'Vehicle', 'Branch', 'Deliveries', 'Status', 'Actions'].map((h) => (
                <th key={h} style={{ fontSize: 12, padding: '10px 12px', textAlign: 'start' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {drivers.length === 0 ? (
              <tr><td colSpan={7}><div className="text-center py-5 text-muted">No data to display here.</div></td></tr>
            ) : (
              drivers.map((driver, i) => (
                <tr key={driver.driverId} style={{ background: i % 2 === 1 ? '#FBF6EA' : '#fff' }}>
                  <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 700 }}>{driver.fullName}</td>
                  <td style={{ padding: '10px 12px', fontSize: 13 }}>{driver.phone}</td>
                  <td style={{ padding: '10px 12px', fontSize: 13 }}>{VEHICLE_LABELS[driver.vehicle]}</td>
                  <td style={{ padding: '10px 12px', fontSize: 13 }}>{branchName(driver.branchId)}</td>
                  <td style={{ padding: '10px 12px', fontSize: 13 }}>{driver.deliveriesCompleted}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span
                      style={{
                        fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 999,
                        background: driver.isActive ? '#DCF3E4' : '#F3DCDC',
                        color: driver.isActive ? 'var(--green-600)' : 'var(--red-600)',
                      }}
                    >
                      {driver.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <div className="d-flex gap-1 flex-wrap">
                      <button
                        className="btn btn-sm"
                        style={{ background: 'var(--blue-600)', color: '#fff', fontSize: 12, fontWeight: 800, borderRadius: 8 }}
                        onClick={() => handleEditClick(driver)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm"
                        style={{ background: 'var(--gold-500)', color: 'var(--maroon-950)', fontSize: 12, fontWeight: 800, borderRadius: 8 }}
                        onClick={() => handleToggleActive(driver.driverId)}
                      >
                        {driver.isActive ? 'Disable' : 'Activate'}
                      </button>
                      <button
                        className="btn btn-sm"
                        style={{ background: 'var(--red-600)', color: '#fff', fontSize: 12, fontWeight: 800, borderRadius: 8 }}
                        onClick={() => handleDelete(driver.driverId)}
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
        <DriverModal
          driver={editingDriver}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function DriverModal({ driver, onClose, onSave }) {
  const [fullName, setFullName] = useState(driver?.fullName || '');
  const [phone, setPhone] = useState(driver?.phone || '');
  const [vehicle, setVehicle] = useState(driver?.vehicle || 'bike');
  const [branchId, setBranchId] = useState(driver?.branchId || mockBranches[0].id);
  const [password, setPassword] = useState(driver?.password || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName || !phone || !password) {
      setError('Please fill in all required fields');
      return;
    }
    const saveError = onSave({ fullName, phone, vehicle, branchId: Number(branchId), password });
    if (saveError) setError(saveError);
  };

  return (
    <div
      className="d-flex align-items-start justify-content-center"
      style={{ position: 'fixed', inset: 0, background: 'rgba(42,21,9,.55)', zIndex: 150, overflowY: 'auto', padding: '40px 16px' }}
      onClick={onClose}
    >
      <div className="bg-white p-4" style={{ borderRadius: 20, width: '100%', maxWidth: 480, boxShadow: 'var(--shadow-card)' }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--maroon-800)' }}>
          {driver ? 'Edit Driver' : 'Add New Driver'}
        </h3>

        {!driver && (
          <p style={{ fontSize: 12, color: 'var(--ink-600)', background: 'var(--gold-200)', padding: '8px 12px', borderRadius: 10, marginBottom: 12 }}>
            🔒 This is the only place a driver account can be created. The driver logs in from their own app using the phone number and password you set here.
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="form-label" style={{ fontSize: 12.5, fontWeight: 800 }}>Driver name</label>
            <input className="form-control" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>

          <div className="mb-2">
            <label className="form-label" style={{ fontSize: 12.5, fontWeight: 800 }}>Mobile number</label>
            <input className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div className="row g-2 mb-2">
            <div className="col-6">
              <label className="form-label" style={{ fontSize: 12.5, fontWeight: 800 }}>Vehicle</label>
              <select className="form-select" value={vehicle} onChange={(e) => setVehicle(e.target.value)}>
                <option value="bike">Motorbike</option>
                <option value="bicycle">Bicycle</option>
                <option value="car">Car</option>
              </select>
            </div>
            <div className="col-6">
              <label className="form-label" style={{ fontSize: 12.5, fontWeight: 800 }}>Branch</label>
              <select className="form-select" value={branchId} onChange={(e) => setBranchId(e.target.value)}>
                {mockBranches.map((b) => (
                  <option key={b.id} value={b.id}>{b.nameEn}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ fontSize: 12.5, fontWeight: 800 }}>Password (the driver logs in with this)</label>
            <input className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
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

export default DriversPanel;