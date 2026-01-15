import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import dayjs from 'dayjs';
import useAppStore from '../../store/useAppStore';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { api } from '../../utils/api';

export default function PatientHistory() {
  const user = useAppStore(state => state.user);
  const [medicines, setMedicines] = useState([]);
  const [adherenceLogs, setAdherenceLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [medsData, logsData] = await Promise.all([
        api.getMedicinesByPatient(user.id),
        api.getAdherenceLogs(user.id)
      ]);
      
      setMedicines(medsData);
      setAdherenceLogs(logsData);
    } catch (error) {
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const groupedLogs = adherenceLogs.reduce((acc, log) => {
    const date = dayjs(log.scheduled_time).format('YYYY-MM-DD');
    if (!acc[date]) acc[date] = [];
    acc[date].push(log);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedLogs).sort().reverse();

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
          <Link to="/patient" className="text-purple-600 font-semibold hover:text-purple-700">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Medicine History</h1>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-6">
        {sortedDates.length === 0 ? (
          <div className="bg-white rounded-lg border-2 border-gray-200 p-8 text-center">
            <p className="text-gray-600 mb-2">No history available yet.</p>
            <p className="text-sm text-gray-500">Start marking your doses to build your adherence history.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedDates.map(date => (
              <div key={date} className="bg-white rounded-lg border-2 border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {dayjs(date).format('MMMM D, YYYY')}
                </h2>
                
                <div className="space-y-3">
                  {groupedLogs[date].map(log => {
                    const medicine = medicines.find(m => m.id === log.medicine_id);
                    if (!medicine) return null;

                    return (
                      <div key={log.id} className="border-2 border-gray-200 rounded-lg p-4 flex justify-between items-center">
                        <div>
                          <h3 className="font-bold text-gray-900">{medicine.name}</h3>
                          <p className="text-gray-700">{medicine.dosage}</p>
                          <p className="text-sm text-gray-500">
                            Time: {dayjs(log.scheduled_time).format('h:mm A')}
                          </p>
                        </div>
                        <StatusBadge status={log.status} />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
