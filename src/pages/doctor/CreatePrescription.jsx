import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../../store/useAppStore';

export default function CreatePrescription() {
  const navigate = useNavigate();
  const addPrescription = useAppStore(state => state.addPrescription);
  const addMedicine = useAppStore(state => state.addMedicine);
  const user = useAppStore(state => state.user);

  const [patientName, setPatientName] = useState('');
  const [medicines, setMedicines] = useState([{
    name: '',
    dosage: '',
    frequency: 1,
    times: [''],
    duration: { start: '', end: '' }
  }]);

  const addMedicineField = () => {
    setMedicines([...medicines, {
      name: '',
      dosage: '',
      frequency: 1,
      times: [''],
      duration: { start: '', end: '' }
    }]);
  };

  const updateMedicine = (index, field, value) => {
    const updated = [...medicines];
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const prescription = {
      patientName,
      doctorId: user.id,
      doctorName: user.name,
      medicines: [],
      createdAt: new Date().toISOString()
    };

    medicines.forEach(med => {
      const medicineId = Date.now().toString() + Math.random();
      addMedicine({ ...med, id: medicineId, prescriptionId: prescription.id });
      prescription.medicines.push(medicineId);
    });

    addPrescription(prescription);
    navigate('/doctor');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b-2 border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Create Prescription</h1>
      </nav>

      <main className="max-w-4xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
            <label className="block text-gray-900 font-bold mb-2">Patient Name</label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none text-lg"
              required
            />
          </div>

          {medicines.map((med, medIndex) => (
            <div key={medIndex} className="bg-white rounded-lg border-2 border-gray-200 p-6 space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Medicine {medIndex + 1}</h3>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Medicine Name</label>
                <input
                  type="text"
                  value={med.name}
                  onChange={(e) => updateMedicine(medIndex, 'name', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Dosage</label>
                <input
                  type="text"
                  value={med.dosage}
                  onChange={(e) => updateMedicine(medIndex, 'dosage', e.target.value)}
                  placeholder="e.g., 500mg, 1 tablet"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                  required
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                  required
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none mb-2"
                    required
                  />
                ))}
                <button
                  type="button"
                  onClick={() => addTimeSlot(medIndex)}
                  className="text-indigo-600 font-semibold hover:text-indigo-700"
                >
                  + Add Time Slot
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Start Date</label>
                  <input
                    type="date"
                    value={med.duration.start}
                    onChange={(e) => updateMedicine(medIndex, 'duration.start', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">End Date</label>
                  <input
                    type="date"
                    value={med.duration.end}
                    onChange={(e) => updateMedicine(medIndex, 'duration.end', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                    required
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
              onClick={() => navigate('/doctor')}
              className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Save Prescription
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
