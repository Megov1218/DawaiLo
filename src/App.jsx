import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAppStore from './store/useAppStore';
import RoleGuard from './components/RoleGuard';
import Toast from './components/Toast';
import Home from './pages/Home';
import Login from './pages/Login';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import AddPatient from './pages/doctor/AddPatient';
import PatientProfile from './pages/doctor/PatientProfile';
import CreatePrescription from './pages/doctor/CreatePrescription';
import EditPrescription from './pages/doctor/EditPrescription';
import PharmacistDashboard from './pages/pharmacist/PharmacistDashboard';
import PatientDashboard from './pages/patient/PatientDashboard';
import PatientHistory from './pages/patient/PatientHistory';

export default function App() {
  const role = useAppStore(state => state.role);

  return (
    <BrowserRouter>
      <Toast />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/doctor" element={
          <RoleGuard allowedRoles={['doctor']}>
            <DoctorDashboard />
          </RoleGuard>
        } />
        
        <Route path="/doctor/add-patient" element={
          <RoleGuard allowedRoles={['doctor']}>
            <AddPatient />
          </RoleGuard>
        } />
        
        <Route path="/doctor/patient/:id" element={
          <RoleGuard allowedRoles={['doctor']}>
            <PatientProfile />
          </RoleGuard>
        } />
        
        <Route path="/doctor/patient/:patientId/prescribe" element={
          <RoleGuard allowedRoles={['doctor']}>
            <CreatePrescription />
          </RoleGuard>
        } />
        
        <Route path="/doctor/edit-prescription/:id" element={
          <RoleGuard allowedRoles={['doctor']}>
            <EditPrescription />
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
        
        <Route path="/dashboard" element={
          role ? <Navigate to={`/${role}`} replace /> : <Navigate to="/login" replace />
        } />
      </Routes>
    </BrowserRouter>
  );
}
