import { useState } from 'react';
import useAppStore from '../../store/useAppStore';
import MedicineCard from '../../components/MedicineCard';

export default function PharmacistDashboard() {
  const user = useAppStore(state => state.user);
  const prescriptions = useAppStore(state => state.prescriptions);
  const medicines = useAppStore(state => state.medicines);
  const logout = useAppStore(state => state.logout);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPrescriptions = prescriptions.filter(p =>
    p.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b-2 border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Pharmacist Portal</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">{user?.name}</span>
            <button onClick={logout} className="text-red-600 font-semibold hover:text-red-700">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search patient by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none text-lg"
          />
        </div>

        <div className="space-y-6">
          {filteredPrescriptions.length === 0 ? (
            <p className="text-gray-600 text-center">No prescriptions found.</p>
          ) : (
            filteredPrescriptions.map(prescription => {
              const prescriptionMedicines = medicines.filter(m =>
                prescription.medicines?.includes(m.id)
              );

              return (
                <div key={prescription.id} className="bg-white rounded-lg border-2 border-gray-200 p-6">
                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Patient: {prescription.patientName}</h2>
                    <p className="text-gray-600">Prescribed by: Dr. {prescription.doctorName}</p>
                    <p className="text-sm text-gray-500">Date: {new Date(prescription.createdAt).toLocaleDateString()}</p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-bold text-gray-900">Medicines to Dispense:</h3>
                    {prescriptionMedicines.map(medicine => (
                      <MedicineCard key={medicine.id} medicine={medicine} />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
