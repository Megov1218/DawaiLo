import { Link } from 'react-router-dom';
import useAppStore from '../../store/useAppStore';

export default function DoctorDashboard() {
  const user = useAppStore(state => state.user);
  const prescriptions = useAppStore(state => state.prescriptions);
  const logout = useAppStore(state => state.logout);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b-2 border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Doctor Portal</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Dr. {user?.name}</span>
            <button onClick={logout} className="text-red-600 font-semibold hover:text-red-700">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <Link
            to="/doctor/create-prescription"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition"
          >
            + Create Prescription
          </Link>
        </div>

        <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Prescriptions</h2>
          
          {prescriptions.length === 0 ? (
            <p className="text-gray-600">No prescriptions created yet.</p>
          ) : (
            <div className="space-y-3">
              {prescriptions.map(prescription => (
                <div key={prescription.id} className="border-2 border-gray-200 rounded-lg p-4">
                  <p className="font-semibold text-gray-900">Patient: {prescription.patientName}</p>
                  <p className="text-gray-600">Medicines: {prescription.medicines?.length || 0}</p>
                  <p className="text-sm text-gray-500">Created: {new Date(prescription.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
