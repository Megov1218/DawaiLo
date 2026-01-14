import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAppStore from './store/useAppStore';
import RoleGuard from './components/RoleGuard';
import Login from './pages/Login';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import CreatePrescription from './pages/doctor/CreatePrescription';
import PharmacistDashboard from './pages/pharmacist/PharmacistDashboard';
import PatientDashboard from './pages/patient/PatientDashboard';
import PatientHistory from './pages/patient/PatientHistory';

export default function App() {
  const role = useAppStore(state => state.role);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/doctor" element={
          <RoleGuard allowedRoles={['doctor']}>
            <DoctorDashboard />
          </RoleGuard>
        } />
        
        <Route path="/doctor/create-prescription" element={
          <RoleGuard allowedRoles={['doctor']}>
            <CreatePrescription />
          </RoleGuard>
        } />
        
        <Route path="/pharmacist" element={
          <RoleGuard allowedRoles={['pharmacist']}>
            <PharmacistDashboard />
          </RoleGuard>
        } />
        
        <Route path="/patient" element={
          <RoleGuard allowedRoles={['patient']}>
            <PatientDashboard />
          </RoleGuard>
        } />
        
        <Route path="/patient/history" element={
          <RoleGuard allowedRoles={['patient']}>
            <PatientHistory />
          </RoleGuard>
        } />
        
        <Route path="/" element={
          role ? <Navigate to={`/${role}`} replace /> : <Navigate to="/login" replace />
        } />
      </Routes>
    </BrowserRouter>
  );
}
