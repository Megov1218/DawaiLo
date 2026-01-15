import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import useAppStore from '../../store/useAppStore';
import { api } from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmDialog from '../../components/ConfirmDialog';

export default function EditPrescription() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAppStore(state => state.user);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [prescription, setPrescription] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [confirmStop, setConfirmStop] = useState(null);

  useEffect(() => {
    loadPrescription();
  }, [id]);

  const loadPrescription = async () => {
    try {
      const prescriptions = await api.getPrescriptionsByDoctor(user.id);
      const presc = prescriptions.find(p => p.id === id);
      
      if (!presc) {
        toast.error('Prescription not found');
        navigate('/doctor');
        return;
      }

      setPrescription(presc);
      const meds = await api.getMedicinesByPrescription(id);
      setMedicines(meds);
    } catch (error) {
      toast.error('Failed to load prescription');
    } finally {
      setLoading(false);
    }
  };

  const updateMedicine = (index, field, value) => {
    const updated = [...medicines];
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      updated[index][parent] = updated[index][parent] || {};
      updated[index][parent][child] = value;
    } else {
      updated[index][field] = value;
    }
    setMedicines(updated);
  };

  const updateTime = (medIndex, timeIndex, value) => {
    const updated = [...medicines];
    updated[medIndex].times[timeIndex] = value;
    setMedicines(updated);
  };

  const addTimeSlot = (medIndex) => {
    const updated = [...medicines];
    updated[medIndex].times.push('');
    setMedicines(updated);
  };

  const addMedicineField = () => {
    setMedicines([...medicines, {
      name: '',
      dosage: '',
      frequency: 1,
      times: [''],
      startDate: '',
      endDate: '',
      status: 'active'
    }]);
  };

  const handleStopMedicine = async (medicineId) => {
    try {
      await api.stopMedicine(medicineId);
      toast.success('Medicine stopped');
      loadPrescription();
    } catch (error) {
      toast.error('Failed to stop medicine');
    }
    setConfirmStop(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const result = await api.updatePrescription(id, {
        medicines: medicines.map(m => ({
          name: m.name,
          dosage: m.dosage,
          frequency: m.frequency,
          times: m.times,
          startDate: m.start_date || m.startDate,
          endDate: m.end_date || m.endDate,
          status: m.status
        }))
      });

      if (result.success) {
        toast.success('Prescription updated successfully');
        navigate(`/doctor/patient/${prescription.patient_id}`);
      } else {
        toast.error('Failed to update prescription');
      }
    } catch (error) {
      toast.error('Failed to update prescription');
    } finally {
      setSaving(false);
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
          <Link to={`/doctor/patient/${prescription?.patient_id}`} className="text-purple-600 font-semibold hover:text-purple-700">
            ← Back to Patient
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Edit Prescription</h1>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6 mb-6">
          <p className="text-gray-900"><span className="font-bold">Patient:</span> {prescription?.patient_name}</p>
          <p className="text-gray-600 text-sm">Created: {new Date(prescription?.created_at).toLocaleDateString()}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {medicines.map((med, medIndex) => (
            <div key={medIndex} className="bg-white rounded-lg border-2 border-gray-200 p-6 space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-gray-900">Medicine {medIndex + 1}</h3>
                {med.id && med.status === 'active' && (
                  <button
                    type="button"
                    onClick={() => setConfirmStop(med.id)}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition"
                  >
                    Stop Medicine
                  </button>
                )}
                {med.status === 'stopped' && (
                  <span className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold">
                    Stopped
                  </span>
                )}
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Medicine Name</label>
                <input
                  type="text"
                  value={med.name}
                  onChange={(e) => updateMedicine(medIndex, 'name', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  required
                  disabled={med.status === 'stopped'}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Dosage</label>
                <input
                  type="text"
                  value={med.dosage}
                  onChange={(e) => updateMedicine(medIndex, 'dosage', e.target.value)}
                  placeholder="e.g., 500mg, 1 tablet"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  required
                  disabled={med.status === 'stopped'}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Frequency (times per day)</label>
                <input
                  type="number"
                  min="1"
                  max="3"
                  value={med.frequency}
                  onChange={(e) => updateMedicine(medIndex, 'frequency', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  required
                  disabled={med.status === 'stopped'}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Intake Times</label>
                {med.times.map((time, timeIndex) => (
                  <input
                    key={timeIndex}
                    type="time"
                    value={time}
                    onChange={(e) => updateTime(medIndex, timeIndex, e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none mb-2"
                    required
                    disabled={med.status === 'stopped'}
                  />
                ))}
                {med.status !== 'stopped' && (
                  <button
                    type="button"
                    onClick={() => addTimeSlot(medIndex)}
                    className="text-purple-600 font-semibold hover:text-purple-700"
                  >
                    + Add Time Slot
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Start Date</label>
                  <input
                    type="date"
                    value={med.start_date || med.startDate}
                    onChange={(e) => updateMedicine(medIndex, 'startDate', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                    required
                    disabled={med.status === 'stopped'}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">End Date</label>
                  <input
                    type="date"
                    value={med.end_date || med.endDate}
                    onChange={(e) => updateMedicine(medIndex, 'endDate', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                    required
                    disabled={med.status === 'stopped'}
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addMedicineField}
            className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            + Add Another Medicine
          </button>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(`/doctor/patient/${prescription?.patient_id}`)}
              className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50"
            >
              {saving ? <LoadingSpinner size="sm" /> : 'Update Prescription'}
            </button>
          </div>
        </form>
      </main>

      <ConfirmDialog
        isOpen={confirmStop !== null}
        title="Stop Medicine?"
        message="This will mark the medicine as stopped. The patient will no longer see it in their active list."
        confirmText="Stop Medicine"
        onConfirm={() => handleStopMedicine(confirmStop)}
        onCancel={() => setConfirmStop(null)}
      />
    </div>
  );
}
