import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import useAppStore from '../../store/useAppStore';
import MedicineCard from '../../components/MedicineCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { api } from '../../utils/api';

export default function PharmacistDashboard() {
  const user = useAppStore(state => state.user);
  const logout = useAppStore(state => state.logout);
  
  const [prescriptions, setPrescriptions] = useState([]);
  const [medicinesByPrescription, setMedicinesByPrescription] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedPrescription, setExpandedPrescription] = useState(null);

  useEffect(() => {
    loadPrescriptions();
  }, []);

  const loadPrescriptions = async () => {
    try {
      const data = await api.getAllPrescriptions();
      setPrescriptions(data);
    } catch (error) {
      toast.error('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const loadMedicines = async (prescriptionId) => {
    if (medicinesByPrescription[prescriptionId]) {
      setExpandedPrescription(expandedPrescription === prescriptionId ? null : prescriptionId);
      return;
    }

    try {
      const medicines = await api.getMedicinesByPrescription(prescriptionId);
      setMedicinesByPrescription(prev => ({
        ...prev,
        [prescriptionId]: medicines
      }));
      setExpandedPrescription(prescriptionId);
    } catch (error) {
      toast.error('Failed to load medicines');
    }
  };

  const filteredPrescriptions = prescriptions.filter(p =>
    p.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.doctor_name.toLowerCase().includes(searchTerm.toLowerCase())
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
            placeholder="Search by patient or doctor name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-lg"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPrescriptions.length === 0 ? (
              <div className="bg-white rounded-lg border-2 border-gray-200 p-8 text-center">
                <p className="text-gray-600">
                  {searchTerm ? 'No prescriptions found matching your search.' : 'No prescriptions available yet.'}
                </p>
              </div>
            ) : (
              filteredPrescriptions.map(prescription => (
                <div key={prescription.id} className="bg-white rounded-lg border-2 border-gray-200 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Patient: {prescription.patient_name}</h2>
                      <p className="text-gray-600">Prescribed by: Dr. {prescription.doctor_name}</p>
                      <p className="text-sm text-gray-500">Date: {new Date(prescription.created_at).toLocaleDateString()}</p>
                    </div>
                    <button
                      onClick={() => loadMedicines(prescription.id)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
                    >
                      {expandedPrescription === prescription.id ? 'Hide Medicines' : 'View Medicines'}
                    </button>
                  </div>

                  {expandedPrescription === prescription.id && medicinesByPrescription[prescription.id] && (
                    <div className="space-y-4 mt-4 pt-4 border-t-2 border-gray-200">
                      <h3 className="font-bold text-gray-900">Medicines to Dispense:</h3>
                      {medicinesByPrescription[prescription.id].length === 0 ? (
                        <p className="text-gray-600">No medicines in this prescription.</p>
                      ) : (
                        medicinesByPrescription[prescription.id].map(medicine => (
                          <MedicineCard key={medicine.id} medicine={{
                            ...medicine,
                            duration: {
                              start: medicine.start_date,
                              end: medicine.end_date
                            }
                          }}>
                            {medicine.status === 'stopped' && (
                              <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                                Stopped
                              </span>
                            )}
                          </MedicineCard>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
