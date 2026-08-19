import { useState } from 'react';
import { useDispatch } from 'react-redux';
import api from '../../shared/api/axiosClient';
import { ENDPOINTS } from '../../shared/api/endpoints';
import { setCredentials } from './authSlice';

function AdminLogin() {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(ENDPOINTS.adminLogin, { username, password });
      dispatch(setCredentials({
        token: response.data.accessToken,
        adminId: response.data.adminId,
        name: response.data.name,
      }));
    } catch (err) {
      setErrorMsg('Incorrect username or password');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div
        className="bg-white p-4"
        style={{ maxWidth: 400, width: '100%', borderRadius: 22, boxShadow: 'var(--shadow-card)', border: '1px solid var(--line)' }}
      >
        <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--maroon-800)', textAlign: 'center' }}>
          Admin Login
        </h2>
        <p className="text-center text-muted" style={{ fontSize: 13 }}>Authorized staff only</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" style={{ fontWeight: 700, fontSize: 13 }}>Username</label>
            <input
              className="form-control"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" style={{ fontWeight: 700, fontSize: 13 }}>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {errorMsg && <p className="text-danger" style={{ fontSize: 12 }}>{errorMsg}</p>}

          <button
            type="submit"
            className="btn w-100"
            style={{ background: 'var(--maroon-800)', color: 'var(--gold-300)', fontWeight: 800, padding: 12, borderRadius: 12 }}
          >
            Login
          </button>

          <p className="text-center text-muted mt-3" style={{ fontSize: 11.5 }}>
            Demo: admin / admin123
          </p>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;