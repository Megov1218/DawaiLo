import { Navigate } from 'react-router-dom';
import useAppStore from '../store/useAppStore';

export default function RoleGuard({ children, allowedRoles }) {
  const role = useAppStore(state => state.role);

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to={`/${role}`} replace />;
  }

  return children;
}
