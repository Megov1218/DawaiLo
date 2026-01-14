import { Link } from 'react-router-dom';
import useAppStore from '../../store/useAppStore';
import StatusBadge from '../../components/StatusBadge';
import dayjs from 'dayjs';

export default function PatientHistory() {
  const medicines = useAppStore(state => state.medicines);
  const adherenceLogs = useAppStore(state => state.adherenceLogs);

  const groupedLogs = adherenceLogs.reduce((acc, log) => {
    const date = dayjs(log.timestamp).format('YYYY-MM-DD');
    if (!acc[date]) acc[date] = [];
    acc[date].push(log);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedLogs).sort().reverse();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b-2 border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link to="/patient" className="text-indigo-600 font-semibold hover:text-indigo-700">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Medicine History</h1>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-6">
        {sortedDates.length === 0 ? (
          <p className="text-gray-600 text-center">No history available yet.</p>
        ) : (
          <div className="space-y-6">
            {sortedDates.map(date => (
              <div key={date} className="bg-white rounded-lg border-2 border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {dayjs(date).format('MMMM D, YYYY')}
                </h2>
                
                <div className="space-y-3">
                  {groupedLogs[date].map(log => {
                    const medicine = medicines.find(m => m.id === log.medicineId);
                    if (!medicine) return null;

                    return (
                      <div key={log.id} className="border-2 border-gray-200 rounded-lg p-4 flex justify-between items-center">
                        <div>
                          <h3 className="font-bold text-gray-900">{medicine.name}</h3>
                          <p className="text-gray-700">{medicine.dosage}</p>
                          <p className="text-sm text-gray-500">
                            Time: {dayjs(log.timestamp).format('h:mm A')}
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
