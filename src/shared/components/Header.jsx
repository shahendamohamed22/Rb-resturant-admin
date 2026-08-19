import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

function Header() {
  const dispatch = useDispatch();
  const name = useSelector((state) => state.auth.name);

  return (
    <header style={{ background: 'var(--maroon-950)', color: 'var(--cream-50)', position: 'sticky', top: 0, zIndex: 60, boxShadow: 'var(--shadow-card)' }}>
      <div className="container d-flex align-items-center justify-content-between py-2">
        <div className="d-flex align-items-center gap-2">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 42, height: 42, background: 'var(--gold-500)', fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--maroon-950)' }}
          >
            R
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--gold-400)', lineHeight: 1 }}>R Burger</div>
            <div style={{ fontSize: 10, letterSpacing: 2, color: 'var(--gold-200)', opacity: 0.8 }}>ADMIN DASHBOARD</div>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          <div
            className="d-flex align-items-center gap-2"
            style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.18)', padding: '6px 14px', borderRadius: 999, fontSize: 12.5, fontWeight: 700 }}
          >
            🛡️ <span>{name}</span>
          </div>
          <button
            className="btn btn-sm"
            style={{ border: '1.5px solid rgba(255,255,255,.25)', color: 'var(--gold-300)', borderRadius: 999, fontWeight: 800 }}
            onClick={() => dispatch(logout())}
          >
            Logout
          </button>
        </div>
      </div>
      <div style={{ height: 10, background: 'linear-gradient(135deg, var(--gold-500) 25%, transparent 25%) -6px 0, linear-gradient(225deg, var(--gold-500) 25%, transparent 25%) -6px 0', backgroundSize: '12px 12px' }} />
    </header>
  );
}

export default Header;