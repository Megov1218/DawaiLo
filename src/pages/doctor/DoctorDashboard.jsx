import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import useAppStore from '../../store/useAppStore';
import { api } from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function DoctorDashboard() {
  const user = useAppStore(state => state.user);
  const logout = useAppStore(state => state.logout);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const data = await api.getPatients();
      setPatients(data);
    } catch (error) {
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div className="flex gap-4 mb-6">
          <Link
            to="/doctor/add-patient"
            className="inline-block bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold text-lg hover:from-green-700 hover:to-emerald-700 transition shadow-lg"
          >
            + Add New Patient
          </Link>
        </div>

        <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">My Patients</h2>
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
            />
          </div>
          
          {loading ? (
            <LoadingSpinner />
          ) : filteredPatients.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'No patients found matching your search.' : 'No patients registered yet.'}
              </p>
              {!searchTerm && (
                <Link
                  to="/doctor/add-patient"
                  className="text-purple-600 font-semibold hover:text-purple-700"
                >
                  Add your first patient →
                </Link>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPatients.map(patient => (
                <Link
                  key={patient.id}
                  to={`/doctor/patient/${patient.id}`}
                  className="border-2 border-gray-200 rounded-lg p-4 hover:border-purple-400 hover:shadow-md transition group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {patient.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-purple-600 group-hover:text-purple-700 font-semibold">
                      View →
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{patient.name}</h3>
                  <p className="text-sm text-gray-600">{patient.email}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Registered: {new Date(patient.created_at).toLocaleDateString()}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
