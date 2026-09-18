import { useSelector } from 'react-redux';
import AdminLogin from './features/auth/AdminLogin';
import AdminDashboard from './features/dashboard/AdminDashboard';

function App() {
  const token = useSelector((state) => state.auth.token);

  if (!token) {
    return <AdminLogin />;
  }

  return <AdminDashboard />;
}

export default App;