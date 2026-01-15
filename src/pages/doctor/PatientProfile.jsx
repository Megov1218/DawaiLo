import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { api } from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import MedicineCard from '../../components/MedicineCard';

export default function PatientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPrescription, setExpandedPrescription] = useState(null);
  const [medicinesByPrescription, setMedicinesByPrescription] = useState({});

  useEffect(() => {
    loadPatientData();
  }, [id]);

  const loadPatientData = async () => {
    try {
      const [patientData, prescriptionsData] = await Promise.all([
        api.getPatient(id),
        api.getPrescriptionsByPatient(id)
      ]);
      
      setPatient(patientData);
      setPrescriptions(prescriptionsData);
    } catch (error) {
      toast.error('Failed to load patient data');
      navigate('/doctor');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b-2 border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link to="/doctor" className="text-purple-600 font-semibold hover:text-purple-700">
            ← Back to Patients
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Patient Profile</h1>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6">
        {/* Patient Info Card */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg p-6 mb-6 text-white shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-3xl font-bold">
                {patient.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-1">{patient.name}</h2>
                <p className="text-lg opacity-90">{patient.email}</p>
                <p className="text-sm opacity-75 mt-1">
                  Patient since: {new Date(patient.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Link
              to={`/doctor/patient/${id}/prescribe`}
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition shadow-md"
            >
              + New Prescription
            </Link>
          </div>
        </div>

        {/* Prescription History */}
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Prescription History</h3>
          
          {prescriptions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No prescriptions yet for this patient.</p>
              <Link
                to={`/doctor/patient/${id}/prescribe`}
                className="text-purple-600 font-semibold hover:text-purple-700"
              >
                Create first prescription →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {prescriptions.map(prescription => (
                <div key={prescription.id} className="border-2 border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-sm text-gray-500">
                        Created: {new Date(prescription.created_at).toLocaleDateString()}
                      </p>
                      {prescription.updated_at !== prescription.created_at && (
                        <p className="text-sm text-gray-500">
                          Updated: {new Date(prescription.updated_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => loadMedicines(prescription.id)}
                        className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-semibold hover:bg-purple-200 transition"
                      >
                        {expandedPrescription === prescription.id ? 'Hide' : 'View'} Medicines
                      </button>
                      <Link
                        to={`/doctor/edit-prescription/${prescription.id}`}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>

                  {expandedPrescription === prescription.id && medicinesByPrescription[prescription.id] && (
                    <div className="space-y-3 mt-4 pt-4 border-t-2 border-gray-200">
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
                            {medicine.status === 'active' && (
                              <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                                Active
                              </span>
                            )}
                          </MedicineCard>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
