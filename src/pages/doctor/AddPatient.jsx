import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { api } from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AddPatient() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const result = await api.registerPatient(formData);

      if (result.success) {
        toast.success('Patient registered successfully');
        navigate(`/doctor/patient/${result.patientId}`);
      } else {
        toast.error(result.message || 'Failed to register patient');
      }
    } catch (error) {
      toast.error('Failed to register patient');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b-2 border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link to="/doctor" className="text-purple-600 font-semibold hover:text-purple-700">
            ← Back to Patients
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Add New Patient</h1>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg border-2 border-gray-200 p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Patient Registration</h2>
            <p className="text-gray-600">Register a new patient to start prescribing medicines</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-900 font-bold mb-2">
                Full Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Rajesh Kumar"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-lg"
                required
              />
            </div>

            <div>
              <label className="block text-gray-900 font-bold mb-2">
                Email Address <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g., rajesh@example.com"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-lg"
                required
              />
              <p className="text-sm text-gray-500 mt-1">Patient will use this email to login</p>
            </div>

            <div>
              <label className="block text-gray-900 font-bold mb-2">
                Password <span className="text-red-600">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password for the patient"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-lg"
                required
                minLength="6"
              />
              <p className="text-sm text-gray-500 mt-1">Minimum 6 characters</p>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Note:</span> Share these credentials with the patient securely. 
                They will need them to login and track their medicines.
              </p>
            </div>

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
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition disabled:opacity-50 flex items-center justify-center"
              >
                {saving ? <LoadingSpinner size="sm" /> : 'Register Patient'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
